import { test } from "@playwright/test";
import { AboutPage } from "./pages/aboutPage";

let aboutPage;

test.beforeEach(async ({ page }) => {
  aboutPage = new AboutPage(page);
  await aboutPage.navigate();
  await aboutPage.goToAboutPage();
});

test("Verify Video Playability", async () => {
  await aboutPage.clickWatchVideo();
  await aboutPage.waitForVideoToLoad();
  await aboutPage.playVideo();
});

test("Go to Blog", async () => {
  await aboutPage.readOurBlog();
});

test("Verify Exit Button Removes Video Preview", async () => {
  await aboutPage.clickWatchVideo();
  await aboutPage.verifyVideoIsVisible();
  await aboutPage.clickExitVideo();
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
