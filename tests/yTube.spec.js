import { expect, test } from "@playwright/test";

test("Check if specific YouTube video is playing", async ({ page }) => {
  // Go to the specific YouTube video
  await page.goto("https://www.youtube.com/watch?v=tcSt81FSvzg");

  // Wait for YouTube's video player to load
  await page.waitForSelector(".html5-main-video");

  // Get the video element
  const video = await page.$(".html5-main-video");

  // Ensure video is present and visible
  expect(await video.isVisible()).toBeTruthy();

  // Click play button if video isn't playing
  const playButton = await page.$("button[aria-label='Play']");
  if (playButton && (await playButton.isVisible())) {
    await playButton.click();
  }

  // Wait for video to start playing
  await page.waitForTimeout(2000);

  // Ensure the video is playing by evaluating its state
  const isPlaying = await video.evaluate(
    (vid) => !vid.paused && !vid.ended && vid.readyState > 2
  );

  // Assertion
  expect(isPlaying).toBeTruthy();
});
