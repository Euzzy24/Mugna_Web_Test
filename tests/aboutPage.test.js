import { test } from "@playwright/test";
import { AboutPage } from "./pages/aboutPage";

// test("Go to Blog", async ({ page }) => {
//   const aboutPage = new AboutPage(page);
//   await aboutPage.navigate();
//   await aboutPage.goToAboutPage();
// });

// test.setTimeout(60000);
// test("Verify Exit Button Removes Video Preview", async ({ page }) => {
//   const aboutPage = new AboutPage(page);

//   await aboutPage.navigate();
//   await aboutPage.goToAboutPage();
//   await aboutPage.clickWatchVideo();
//   await aboutPage.verifyVideoIsVisible();
//   //   await aboutPage.verifyVideoIsPlayable();
//   await aboutPage.clickExitVideo();
//   await aboutPage.verifyVideoIsRemoved();
// });

// test("Verify Video Playability", async ({ page }) => {
//   const aboutPage = new AboutPage(page);

//   await aboutPage.navigate();
//   await aboutPage.goToAboutPage();
//   await aboutPage.clickWatchVideo();
//   await aboutPage.verifyVideoIsVisible();
//   await aboutPage.verifyVideoIsPlayable();
// });

test("Verify Animation on Minnies", async ({ page }) => {
  const aboutPage = new AboutPage(page);

  await aboutPage.navigate();
  await aboutPage.goToAboutPage();
  await aboutPage.hoverMinnies();
});
