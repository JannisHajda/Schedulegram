# Schedulegram
Tool that **automates** your Instagram uploads via the Instagram Creator Studio implemented in NodeJS using the Puppeteer module.

## Installation💻
```
yarn install
```
**Important** depending on your system, make sure to use `npm install` instead.

**That's it** 🚀

## Running Schedulegram🏃‍♂️
To run Schedulegram, you'll need to run the `src/index.js` script you've just downloaded. 
You can put in your account details now by passing the username and the password parameters to the `new Schedulegram()` function in your `src/index.js` script, like so:

```javascript
let schedulegram = new Schedulegram(email="mail@example.com", password="ExamplePassword123")
```

**Available paramerters**

Parameter|Description|Type
-|-|-
email|Your Facebook email|string
password|Your Facebook password|string
multipleAccounts|Do you manage more than one Instagram account via the Creator Studio?|bool

To plan posts you'll need to call the `schedulePosts()` function like so:

```javascript
await schedulegram.schedulePosts([post1, ..., postn])
```

**Post object**
```javascript
let post = {
  account: "Instagram username (only necessary if you manage multiple accounts via the Instagram Creator Studio)",
  description: "The post's description",
  file: "Path to the Image you want to upload.",
  release: {
    date: "dd.mm.yyyy",
    time: "hh:mm"
  }
}
```

## Attention🛑
Please make sure that your Instagram Business account is connected to a Facebook page connected to your Facebook account. Otherwise the tool isn't going to work.
