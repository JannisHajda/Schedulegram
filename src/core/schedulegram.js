const puppetter = require("puppeteer");
const sleep = require("util").promisify(setTimeout);
const fs = require("fs");

class Schedlugram {
  constructor(email = "", password = "", multipleAccounts = false, posts = []) {
    this.email = email;
    this.password = password;
    this.posts = posts;
    this.multipleAccounts = multipleAccounts;

    this.config = JSON.parse(fs.readFileSync("src/core/config.json"));

    this.initPuppeteer();
  }

  async initPuppeteer() {
    this.browser = await puppetter.launch({
      headless: false,
      args: ["--lang=en-GB"],
    });

    this.page = await this.browser.newPage();
    this.login();
  }

  async login() {
    let button;

    await this.page.goto(this.config.loginURL, {
      waitUntil: "networkidle2",
    });

    button = (await this.page.$x(this.config.selectors.facebookLoginBtn))[0];
    await button.click({ delay: this.config.delays.clickDelay });

    await this.page.waitForNavigation({ waitUntil: "networkidle2" });

    // Check for cookie consent
    let cookieConsent = await this.page.$(this.config.selectors.cookieConsent);

    if (cookieConsent) {
      button = await this.page.$(this.config.selectors.acceptCookiesBtn);
      await button.click({ delay: this.config.delays.clickDelay });
    }

    // Enter Login Data
    await this.page.type(this.config.selectors.emailInput, this.email, {
      delay: this.config.delays.typeDelay,
    });
    await this.page.type(this.config.selectors.passwordInput, this.password, {
      delay: this.config.delays.typeDelay,
    });

    // Click Login Btn
    await this.page.click(this.config.selectors.loginBtn, {
      delay: this.config.delays.clickDelay,
    });

    await this.page.waitForNavigation({ waitUntil: "networkidle2" });

    await this.page.click(this.config.selectors.instagramIcon, {
      delay: this.config.delays.clickDelay,
    });

    this.schedulePosts();
  }

  async schedulePosts() {
    let button;

    for (let post of this.posts) {
      await this.page.reload({ waitUntil: "networkidle2" });

      await this.page.waitForXPath(this.config.selectors.createPostBtn);

      // Click create Post Button
      button = (await this.page.$x(this.config.selectors.createPostBtn))[0];
      await button.click({ delay: this.config.delays.clickDelay });

      // Click Instagram Feed
      await this.page.waitForXPath(this.config.selectors.instagramFeedBtn);

      button = (await this.page.$x(this.config.selectors.instagramFeedBtn))[0];
      await button.click({ delay: this.config.delays.clickDelay });

      if (this.multipleAccounts) {
        await this.page.waitForXPath(this.config.selectors.accountList);

        let accountList = (
          await this.page.$x(this.config.selectors.accountList)
        )[0];

        button = (
          await accountList.$x(`div[contains(., "${post.account}")]`)
        )[0];
        await button.click({ delay: this.config.delays.clickDelay });
      }

      // Add description
      await this.page.waitForSelector(this.config.selectors.descriptionInput);

      let descriptionInput = await this.page.$(
        this.config.selectors.descriptionInput
      );
      await descriptionInput.type(post.description, {
        delay: this.config.delays.typeDelay,
      });

      // Add Image
      button = (await this.page.$x(this.config.selectors.addImageBtn))[0];
      await button.click({ delay: this.config.delays.clickDelay });

      await this.page.waitForSelector(this.config.selectors.imageInput);

      let imageInput = await this.page.$(this.config.selectors.imageInput);
      await imageInput.uploadFile(post.file);

      // Schedule Post
      button = (await this.page.$x(this.config.selectors.expandBtn))[0];
      await button.click({ delay: this.config.delays.clickDelay });

      button = (await this.page.$x(this.config.selectors.schedulePostBtn))[0];
      await button.click({ delay: this.config.delays.clickDelay });

      // Add Release Date
      let releaseDateInput = await this.page.$(
        this.config.selectors.releaseDateInput
      );
      await releaseDateInput.type(post.release.date, {
        delay: this.config.delays.typeDelay,
      });

      // Add Release Time
      let releaseTime = post.release.time.split(":");

      let releaseTimeInput = await this.page.$$(
        this.config.selectors.releaseTimeInput
      );
      let hourInput = releaseTimeInput[0];
      let minuteInput = releaseTimeInput[1];

      await hourInput.type(releaseTime[0], {
        delay: this.config.delays.typeDelay,
      });
      await this.page.waitForTimeout(100);
      await minuteInput.type(releaseTime[1], {
        delay: this.config.delays.typeDelay,
      });

      // Publish
      button = (await this.page.$x(this.config.selectors.releaseBtn))[0];
      await button.click(this.config.delays.clickDelay);

      await sleep(this.config.delays.postDelay);
    }

    this.closePuppeteer();
  }

  async closePuppeteer() {
    this.page.close();
    this.browser.close();
  }
}

module.exports = Schedlugram;
