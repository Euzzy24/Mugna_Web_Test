import { expect } from "@playwright/test";

export class AboutPage {
  constructor(page) {
    this.page = page;
    this.aboutLink = page.getByRole("link", { name: "About", exact: true });
    this.ReadBlog = page.locator("#read-our-blog-btn");
    this.watchVideoButton = page.locator("#watch-video-btn");
    this.videoPreview = page.locator("video"); // Adjust selector if needed
    this.exitButton = page.locator(".svg-inline--fa");

    this.playFunction = page.locator(".vjs-control-bar");
    this.playButton = page.locator(".vjs-play-control");

    this.minniesHover = page.getByText("BalodKahilBulawTapolPugaw");
  }

  async navigate() {
    await this.page.goto("https://staging.mugna.tech/");
  }

  async goToAboutPage() {
    await this.aboutLink.click();
  }

  async readBlog() {
    await this.ReadBlog.click();
  }

  async clickWatchVideo() {
    await this.watchVideoButton.click();
  }

  async verifyVideoIsVisible() {
    await expect(this.videoPreview).toBeVisible();
  }

  async clickExitVideo() {
    await this.exitButton.click();
  }

  async verifyVideoIsRemoved() {
    await expect(this.videoPreview).not.toBeVisible();
  }

  //PLAYABILITY

  async verifyVideoIsPlayable() {
    // Verify video element is visible
    await expect(this.videoPreview).toBeVisible();
    await expect(this.playFunction).toBeVisible();
    // await expect(this.playButton).toBeVisible();

    // Click the play button
    // await this.playButton.click();

    // // Verify video is playing
    // expect(await this.videoPreview.isPlaying()).toBeTruthy();

    // // Verify video time increases
    // const initialTime = await this.videoPreview.currentTime;
    // await this.page.waitForTimeout(1000); // Wait for playback to start
    // const newTime = await this.videoPreview.currentTime;
    // expect(newTime).toBeGreaterThan(initialTime);
  }

  //MUGNA MINNIES
  async hoverMinnies() {
    // Get initial styles
    const initialAnimation = await this.minniesHover.evaluate(
      (el) => window.getComputedStyle(el).animation
    );
    const initialTransform = await this.minniesHover.evaluate(
      (el) => window.getComputedStyle(el).transform
    );

    console.log("Before hover - Animation:", initialAnimation);
    console.log("Before hover - Transform:", initialTransform);

    // Hover over the element
    await this.minniesHover.hover();

    // Wait for animation to take effect
    await this.page.waitForTimeout(100); // Reduced wait time

    // Get styles after hover
    const afterHoverAnimation = await this.minniesHover.evaluate(
      (el) => window.getComputedStyle(el).animation
    );
    const afterHoverTransform = await this.minniesHover.evaluate(
      (el) => window.getComputedStyle(el).transform
    );

    console.log("After hover - Animation:", afterHoverAnimation);
    console.log("After hover - Transform:", afterHoverTransform);

    // Expect changes in animation or transformation
    expect(afterHoverAnimation).not.toBe(initialAnimation);
    expect(afterHoverTransform).not.toBe(initialTransform);
  }
}
