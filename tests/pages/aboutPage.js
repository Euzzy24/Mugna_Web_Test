import { expect } from "@playwright/test";

export class AboutPage {
  constructor(page) {
    this.page = page;
    this.aboutLink = page.getByRole("link", { name: "About", exact: true });
    this.readBlog = page.getByRole("link", { name: "Read Our Blog" });
    this.blogId = page.locator("#articles");
    this.watchVideoButton = page.locator("#watch-video-btn");
    this.videoPreview = page.locator("video");
    this.exitButton = page.locator(".svg-inline--fa");
    this.playButton = page.locator(".vjs-big-play-button");
    this.videoPlaying = page.locator(".video-js.vjs-playing");
    this.playControl = page.getByRole("button", { name: /play|pause/i });
    this.playStatus = this.playControl.locator(".vjs-control-text");

    this.teamImagesHidden = page.locator(
      ".emp_illustration:not(.emp_illustration_show) img"
    );
    this.teamImagesVisible = page.locator(".emp_illustration_show");

    this.mugnaMinnies = page.locator(
      'div.group img[alt="mugna minnie image"], div.group img[alt="ph map"]'
    );
    this.groupMinnies = page.locator(
      "div.group.relative.flex.items-center.justify-center"
    );

    this.iconStart = page.locator('img[alt="asdasd"]');
    // this.iconFilled = page.locator('img[src*="icon-filled"]');
    this.textElement = page.locator("p", {
      hasText: "We envision a world where",
    });
  }

  async navigate() {
    await this.page.goto("https://mugna.tech/about");
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    

    // await this.page.goto("https://mugna.tech");
  }

  // async goToAboutPage() {
  //   await this.aboutLink.click();
  // }

  async readOurBlog() {
    await this.readBlog.click();
    await this.page.waitForURL("https://mugna.tech/blog"); // Waits for navigation
    console.log("Successfully navigated to blog page");
  }

  async clickWatchVideo() {
    await this.watchVideoButton.click();
  }

  // async verifyVideoIsVisible() {
  //   await expect(this.videoPreview).toBeVisible();
  // }

  // async clickExitVideo() {
  //   await this.exitButton.click();
  //   await expect(this.videoPreview).not.toBeVisible();
  // }

  async waitForVideoToLoad() {
    await this.videoPreview.waitFor();
  }
  async playVideo() {
    console.log(" Attempting to play the video...");

    // Check if the play button is visible
    if (!(await this.playButton.isVisible())) {
      console.warn(" Play button is not visible. Skipping video playback.");
      return;
    }

    console.log(" Play button is visible. Scrolling into view...");
    await this.playButton.scrollIntoViewIfNeeded();

    // Click the play button
    console.log(" Clicking the play button...");
    await this.playButton.click();

    // Ensure the video is playing
    console.log(" Waiting for video to start playing...");
    await expect(this.videoPlaying).toBeVisible();
    console.log(" Video is now playing!");

    // Get the play status text
    const statusText = await this.playStatus.textContent();
    console.log(`Current play status: "${statusText}"`);
    const isPlaying = /play/i.test(statusText);

    if (isPlaying) {
      console.log(" Video is playing. Clicking pause...");
      await this.playControl.click();
      await expect(this.playStatus).not.toHaveText(/pause/i);
      console.log(" Video is now paused.");
    } else {
      console.log(" Video is paused. Clicking play...");
      await this.playControl.click();
      await expect(this.playStatus).toHaveText(/play/i);
      console.log("Video is now playing.");
    }

    // Exit the video
    console.log("Exiting the video...");
    await this.exitButton.click();
    // await this.clickExitVideo();
  }

  async teamScroll() {
    // Ensure Page is Fully Loaded
    await this.page.waitForTimeout(2000);

    //  Locate Initially Hidden Images (Before Scroll)
    this.teamImagesHidden = this.page.locator(
      ".emp_illustration:not(.emp_illustration_show) img"
    );
    await this.page.waitForSelector(
      ".emp_illustration:not(.emp_illustration_show) img",
      { timeout: 5000 }
    );
    await this.teamImagesHidden.first().waitFor({ timeout: 5000 });

    let hiddenImages = await this.teamImagesHidden.all();

    if (hiddenImages.length === 0) {
      console.error("❌ No hidden images found! Checking with JS...");
      let jsHiddenImages = await this.page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            ".emp_illustration:not(.emp_illustration_show) img"
          )
        ).map((img) => img.getAttribute("alt"))
      );
      console.log("🔎 JS-detected hidden images:", jsHiddenImages);
      throw new Error("❌ No hidden images found before scrolling!");
    }

    let hiddenAlts = new Set();
    for (const image of hiddenImages) {
      let altText = await image.getAttribute("alt");
      if (altText) hiddenAlts.add(altText);

      // Assertion: Ensure Image Does NOT Have `.emp_illustration_show` Class
      let hasShowClass = await image.evaluate((img) =>
        img
          .closest(".emp_illustration")
          ?.classList.contains("emp_illustration_show")
      );
      expect(hasShowClass).toBeFalsy();
    }

    console.log(
      "Initially Hidden Image ALT Attributes:",
      Array.from(hiddenAlts)
    );

    // Scroll & Verify Visibility
    let attempts = 0;
    const maxAttempts = 7;
    let visibleAlts = new Set();

    while (attempts < maxAttempts) {
      await this.page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await this.page.waitForTimeout(600);

      // Ensure new images load
      await this.page.waitForSelector(".emp_illustration_show img", {
        visible: true,
      });

      let visibleImages = await this.page
        .locator(".emp_illustration_show img")
        .all();
      let currentScrollAlts = [];

      for (const image of visibleImages) {
        let altText = await image.getAttribute("alt");
        if (altText) {
          visibleAlts.add(altText);
          currentScrollAlts.push(altText); // Collect for this scroll
        }
      }

      // 🔹 **LOG EVERY VISIBLE IMAGE ALT AFTER SCROLL**
      console.log(
        `Scroll ${attempts + 1}: Found ${
          visibleAlts.size
        } unique visible images`
      );
      console.log("👀 Visible Images (Current Scroll):", currentScrollAlts);

      // Assertion: Ensure all hidden images are now visible
      if ([...hiddenAlts].every((alt) => visibleAlts.has(alt))) {
        console.log(
          `  All hidden images are now visible after ${attempts + 1} scroll(s)`
        );
        break;
      }

      attempts++;
    }

    // Final Assertion: Ensure All Initially Hidden Images Are Now Visible
    expect([...hiddenAlts].every((alt) => visibleAlts.has(alt))).toBeTruthy();
    console.log(" Final Visible Image List:", Array.from(visibleAlts));
  }

  async envisionAnimation() {
    await this.page.waitForSelector('img[alt="asdasd"]', {
      state: "attached",
      timeout: 6000,
    });

    const images = this.page.locator('img[alt="asdasd"]');
    const count = await images.count();
    console.log(`Found ${count} images with alt="asdasd"`);

    // Capture initial styles before scrolling
    const initialStylesList = [];
    for (let i = 0; i < count; i++) {
      const styles = await images.nth(i).evaluate((el) => ({
        opacity: getComputedStyle(el).opacity,
        scale: getComputedStyle(el).scale,
      }));
      initialStylesList.push(styles);
      console.log(`Image ${i + 1} initial styles:`, styles);
    }

    await this.page.evaluate(() =>
      window.scrollBy(0, window.innerHeight * 3.5)
    );

    // Wait for animation to complete
    await this.page.waitForTimeout(8000);
    const isVisible = await this.textElement.isVisible();
    expect(isVisible).toBeTruthy();

    // Capture final styles AFTER scrolling
    for (let i = 0; i < count; i++) {
      const finalStyles = await images.nth(i).evaluate((el) => ({
        opacity: getComputedStyle(el).opacity,
        scale: getComputedStyle(el).scale,
        transition: getComputedStyle(el).transition, // Ensure a transition exists
      }));

      console.log(`Image ${i + 1} final styles:`, finalStyles);

      // Ensure animation happened
      expect(finalStyles.opacity).not.toBe(initialStylesList[i].opacity);
      expect(finalStyles.transition).not.toBe("");
      expect(finalStyles.transition).not.toBe("none");
    }
  }

  async hoverOverGroupDiv() {
    console.log("Starting hoverOverGroupDiv test...");

    // Ensure it navigates to the groupMinnies
    console.log("Scrolling to groupMinnies...");
    await this.groupMinnies.scrollIntoViewIfNeeded();
    console.log("groupMinnies is now in view.");

    // Capture initial transform values before hover
    console.log("Capturing initial transform values...");
    const initialTransforms = await this.mugnaMinnies.evaluateAll((elements) =>
      elements.map((el) => window.getComputedStyle(el).transform)
    );
    console.log("Initial Transforms:", initialTransforms);

    // Hover over the parent div (this should trigger the group-hover effect)
    console.log("Hovering over groupMinnies...");
    await this.groupMinnies.hover();

    // Wait for any hover animations
    console.log("Waiting for hover effect to take place...");
    await this.page.waitForTimeout(1000);

    // Capture transform values after hover
    console.log("Capturing transform values after hover...");
    const finalTransforms = await this.mugnaMinnies.evaluateAll((elements) =>
      elements.map((el) => window.getComputedStyle(el).transform)
    );
    console.log("Final Transforms:", finalTransforms);

    // Verify that the transform values have changed
    console.log("Verifying transformation changes...");
    finalTransforms.forEach((transform, index) => {
      console.log(
        `Comparing element ${index + 1} - Initial: ${
          initialTransforms[index]
        } | Final: ${transform}`
      );

      expect(transform).not.toEqual(initialTransforms[index]); // Ensures a change happened
      expect(transform).not.toBe("none"); // Ensures a valid transformation
    });

    console.log("Hover effect applied successfully!");
  }
}
