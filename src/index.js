const Schedulegram = require("./core/schedulegram");
const dotenv = require("dotenv").config();

(async () => {
  let schedulegram = new Schedulegram(
    (email = "jannis.hajda@protonmail.com"),
    (password = "vP15@p#AG@i3ynW42pjY"),
    (multipleAccounts = true)
  );
  await schedulegram.initPuppeteer();
  await schedulegram.login();
  await schedulegram.schedulePosts([
    {
      account: "pupwear.store",
      description: "Test 1",
      file: "C:/Users/janni/Documents/GitHub/schedulegram/test.jpg",
      release: {
        date: "28.11.2019",
        time: "18:15"
      }
    },
    {
      account: "shototd",
      description: "Test 2",
      file: "C:/Users/janni/Documents/GitHub/schedulegram/test.jpg",
      release: {
        date: "29.11.2019",
        time: "18:15"
      }
    }
  ]);
  await schedulegram.close();
})();
