const puppeteer = require("puppeteer");

class Schedulegram {
  constructor(email = "", password = "", multipleAccounts = false) {
    this.email = email;
    this.password = password;
    this.multipleAccounts = multipleAccounts;
  }

  async initPuppeteer() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: ["--lang=en-GB"]
    });

    this.page = await this.browser.newPage();
  }

  async login() {
    await this.page.goto("https://www.facebook.com/creatorstudio/", {
      waitUntil: "networkidle2"
    });

    /* Click "Log In or Sign Up" button */
    let loginButton = await this.page.$('a[type="button"');
    await loginButton.click();

    await this.page.waitForNavigation({ waitUntil: "networkidle2" });

    /* Enter login data */
    await this.page.type('input[name="email"]', this.email, { delay: 128 });
    await this.page.type('input[name="pass"]', this.password, { delay: 128 });

    /* Click "Log In" button */
    loginButton = await this.page.$('button[name="login"]');
    await loginButton.click();

    await this.page.waitForNavigation({ waitUntil: "networkidle2" });
  }

  async schedulePosts(posts) {
    /* Click on Instagram tab */
    let instagramButton = await this.page.$(
      'div[id="media_manager_chrome_bar_instagram_icon"]'
    );
    await instagramButton.click();

    await this.page.waitFor('a[data-testid="create_post_button"]');
    await this.page.waitFor(500);

    for (let post of posts) {
      /* Click on "Create post" button */
      let createPostButton = await this.page.$(
        'a[data-testid="create_post_button"]'
      );
      await createPostButton.click();

      await this.page.waitFor('span[data-testid="instagram_feed_button"]');
      await this.page.waitFor(500);

      /* Click on "Instagram-feed" */
      let feedButton = await this.page.$(
        'span[data-testid="instagram_feed_button"]'
      );
      await feedButton.click();

      if (this.multipleAccounts) {
        await this.page.waitForXPath("/html/body/div[5]/div/div/div[3]");
        await this.page.waitFor(500);

        /* Select instagram account */
        let accounts = (
          await this.page.$x("/html/body/div[5]/div/div/div[3]")
        )[0];
        let accountButton = (
          await accounts.$x(
            `/html/body/div[5]/div/div/div[3]/div/span/div[2]/span/div[contains(text(), "${post.account}")]`
          )
        )[0];
        await accountButton.click();
      }

      await this.page.waitFor('div[aria-autocomplete="list"]');
      await this.page.waitFor(500);

      /* Add description */
      let descriptionInput = await this.page.$('div[aria-autocomplete="list"]');
      await descriptionInput.type(post.description, { delay: 128 });

      /* Add image file */
      let addContentButton = await this.page.$(
        'span[data-testid="primary_add_content_button"]'
      );
      await addContentButton.click();

      await this.page.waitFor('input[accept="video/*, image/*"]');
      await this.page.waitFor(500);

      let fileInput = await this.page.$('input[accept="video/*, image/*"]');
      await fileInput.uploadFile(post.file);

      /* Click arrow button */
      let arrowButton = (await this.page.$$('button[aria-haspopup="true"]'))[2];
      await arrowButton.click();

      await this.page.waitForXPath(
        '//button[contains(text(), "dropdown menu item")]'
      );
      await this.page.waitFor(500);

      /* Click schedule post button */
      let schedulePostButton = (await this.page.$$('div[role="checkbox"]'))[1];
      await schedulePostButton.click();
      await this.page.waitFor(500);

      await this.page.waitFor('input[placeholder="tt.mm.jjjj"]');

      /* Add release date */
      let dateInput = await this.page.$('input[placeholder="tt.mm.jjjj"]');
      await dateInput.type(post.release.date, { delay: 128 });
      await this.page.waitFor(500);

      /* Add release time */
      let releaseTime = post.release.time.split(":");
      let timeInput = await this.page.$$('input[role="spinbutton"]');
      let hourInput = timeInput[0];
      let minuteInput = timeInput[1];

      await hourInput.type(releaseTime[0], { delay: 128 });
      await this.page.waitFor(500);

      await minuteInput.type(releaseTime[1], { delay: 128 });
      await this.page.waitFor(500);

      /* Click publish button */
      let publishButton = await this.page.$(
        'button[data-testid="publish_button"]'
      );
      await publishButton.click();

      await this.page.waitFor(10000);
    }
  }

  async close() {
    await this.page.close();
    await this.browser.close();
  }
}

module.exports = Schedulegram;
