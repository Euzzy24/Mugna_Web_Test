import { test,expect } from "@playwright/test";
import { AboutPage } from "./pages/aboutPage";

let aboutPage;

test.beforeEach(async ({ page }) => {
  aboutPage = new AboutPage(page);
  await aboutPage.navigate();
  // await aboutPage.goToAboutPage();
});

test("Verify Video Playability", async () => {
  await aboutPage.clickWatchVideo();
  await aboutPage.waitForVideoToLoad();
  await aboutPage.playVideo();
  await expect(aboutPage.videoPreview).not.toBeVisible();
  console.log("Video playback test completed!");



  console.log("Test Passed");

});

test("Go to Blog", async () => {
  await aboutPage.readOurBlog();
  await expect(aboutPage.page).toHaveURL(/\/blog$/);

  console.log("Test Passed");

 
});

test("Verify Exit Button Removes Video Preview", async () => {
  await aboutPage.clickWatchVideo();
  await expect(aboutPage.videoPreview).toBeVisible();
  await aboutPage.exitButton.click();
  await expect(aboutPage.videoPreview).toBeHidden();
   //   await expect(this.videoPreview).not.toBeVisible();
  // await aboutPage.clickExitVideo();

  console.log("Test Passed");

});

test("Verify Team appears on scroll", async () => {
  await aboutPage.teamScroll();
});

test("Verify animation on envision section", async () => {
  await aboutPage.envisionAnimation();
});

test("Verify Hover on Mugna Minnies", async () => {
  await aboutPage.hoverOverGroupDiv();
});
