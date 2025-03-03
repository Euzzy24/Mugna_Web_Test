import { expect } from "@playwright/test";

export class AboutPage {
  constructor(page) {
    this.page = page;
    this.aboutLink = page.getByRole("link", { name: "About", exact: true });
    this.readBlog = page.getByRole("link", { name: "Read Our Blog" });
    this.watchVideoButton = page.locator("#watch-video-btn");
    this.videoPreview = page.locator("video");
    this.exitButton = page.locator(".svg-inline--fa");
    this.verifyPlay = page.locator(".video-js.vjs-playing");
    this.statusIndicator = page.getByRole("status", { name: /Play|Pause/i });
    this.playControl = page.getByRole("button", { name: /play|pause/i });
    this.playStatus = this.playControl.locator(".vjs-control-text");
    this.playButton = page.locator(".vjs-big-play-button");
    this.playFunction = page.locator(".vjs-control-bar");

    this.employeeOnScroll = page.locator(
      ".emp_illustration:not(.emp_illustration_show)"
    );
    this.employeeVisible = page.locator(".emp_illustration_show");
    this.mugnaMinnies = page.locator('img[alt="mugna minnie image"]');

    this.iconStart = page.locator('img[src*="icon-start"]');
    this.iconFilled = page.locator('img[src*="icon-filled"]');
    this.textElement = page.locator("p", {
      hasText: "We envision a world where",
    });
  }

  async navigate() {
    await this.page.goto("https://staging.mugna.tech/");
  }

  async goToAboutPage() {
    await this.aboutLink.click();
  }

  async readOurBlog() {
    await this.readBlog.click();
  }

  async clickWatchVideo() {
    await this.watchVideoButton.click();
  }

  async verifyVideoIsVisible() {
    await expect(this.videoPreview).toBeVisible();
  }

  async clickExitVideo() {
    await this.exitButton.click();
    await expect(this.videoPreview).not.toBeVisible();
  }

  async waitForVideoToLoad() {
    await this.videoPreview.waitFor();
  }

  async playVideo() {
    if (!(await this.playButton.isVisible())) return;

    await this.playButton.scrollIntoViewIfNeeded();
    await this.playButton.click();
    await expect(this.verifyPlay).toBeVisible();

    const buttonText = await this.playStatus.textContent();

    if (/play/i.test(buttonText)) {
      await expect(this.playControl).toBeVisible();
      await expect(this.playControl).toBeEnabled();
      await this.playControl.click();
      await expect(this.playStatus).toHaveText(/pause/i);
    } else {
      await this.playControl.click();
      await expect(this.playStatus).toHaveText(/play/i);
    }

    await this.clickExitVideo();
  }

  async teamScroll() {
    for (const element of await this.employeeOnScroll.elementHandles()) {
      expect(await element.isVisible()).toBeFalsy();
    }

    await this.page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
    await this.page.waitForTimeout(1000);

    for (const element of await this.employeeVisible.elementHandles()) {
      expect(await element.isVisible()).toBeTruthy();
    }
  }
  async envisionAnimation() {
    // Capture initial styles before animation
    const initialIconStartTransform = await this.iconStart.evaluate(
      (el) => getComputedStyle(el).transform
    );
    const initialIconFilledTransform = await this.iconFilled.evaluate(
      (el) => getComputedStyle(el).transform
    );
    const initialTextOpacity = await this.textElement.evaluate(
      (el) => getComputedStyle(el).opacity
    );

    console.log("Initial styles captured.");

    // Wait for animation to complete
    await this.page.waitForFunction(
      ([
        iconStartSelector,
        iconFilledSelector,
        textSelector,
        initialValues,
      ]) => {
        const iconStart = document.querySelector(iconStartSelector);
        const iconFilled = document.querySelector(iconFilledSelector);
        const textElement = document.querySelector(textSelector);

        if (!iconStart || !iconFilled || !textElement) return false;

        const iconStartTransform = getComputedStyle(iconStart).transform;
        const iconFilledTransform = getComputedStyle(iconFilled).transform;
        const textOpacity = getComputedStyle(textElement).opacity;

        return (
          iconStartTransform !== initialValues[0] ||
          iconFilledTransform !== initialValues[1] ||
          textOpacity !== initialValues[2]
        );
      },
      [
        'img[src*="icon-start"]',
        'img[src*="icon-filled"]',
        "p",
        [
          initialIconStartTransform,
          initialIconFilledTransform,
          initialTextOpacity,
        ],
      ]
    );
    console.log("Animation is applied");
  }
  async hoverMugnaMinnies() {
    const count = await this.mugnaMinnies.count();
    for (let i = 0; i < count; i++) {
      const image = this.mugnaMinnies.nth(i);
      await image.hover();
      await this.page.waitForTimeout(500);

      const transform = await image.evaluate(
        (el) => window.getComputedStyle(el).transform
      );

      expect(transform).not.toBe("none");
    }
  }
}
