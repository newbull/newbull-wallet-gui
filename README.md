# NewBull Wallet GUI

[NewBull Wallet GUI](https://github.com/newbull/newbull-wallet-gui) is a simple and lightweight wallet gui written in PHP(no database required) with `easybitcoin.php` ([get it here](https://github.com/aceat64/EasyBitcoin-PHP)).

NewBull Wallet GUI work with [NewBull Core](https://newbull.org) fine. It's should work with others pow block chain, such as Bitcoin.

For Windows11/10/8.1/8/7, you may download demo from [here](http://192.248.179.22/newbull-win-x86_64-0.14.2.20221207.7z), and use (get-filehash "this file fullpath") with powershell to check the file hash sha256 must be C0EAA132B57D99CA88A5905BD0F4F5D19DC0BB10FA64900F72A736DF7438AC82.  When you unzip it, just run start-newbull-gui.bat, if everything ok, you will see the demo.

## Requirements

- Your PC of running NewBull Core
- NewBull Core v0.14.2
- Apache 2.4.x
- PHP 5.6.x with CURL and JSON support enabled

## Installation

Installation is quite simple, and just complete the following steps:

- Copy the contents of the archive to your pc.
- Modify the conf/config.php file with your own info and NewBull RPC info.
- That's it! Open your any Modern Browsers to the install URL, and the wallet gui should come up.

Note:

1. If you do not know about apache url_rewrite, please turn off the url_rewrite configuration in conf/config.php file;

## Usage

Below shows the URLs available:

- / = Home page, showig overview.
- /send = send newbull.
- /receive = receive newbull.
- /address = get new address.
- /history = View all transaction.

## Theme / Template Modifications

- Content css, js, img, pages, header and footer files are in /themes/theme2/ directory.
- CSS uses Bootstrap 4.6.0 as requested.

## Donations

NB: NbUSBit9Q8mrDYPMwv6fW17rykThe3X735

ETH: 0xdA667f1921A2e454A1cD3E9D90c75a7c0EE94193

BTC:

LTC:

## License

MIT

---

## Changelog

2022-12-08 0.14.2.18

add Blocks downloading... status;

add current blocks, blockchain headers and latest blockchain mediantime;

remove Wallet Version from Overview page;

remove Mining... status;

fix some known issues;

2022-11-30 0.14.2.17

change version from 1.7.0 to 0.14.2.17, This means that the current version is compatible with newbull/bitcoin core 0.14.2, and this is 17th update;

add auto detection about root path;

add highlight about navbar active item;

add explore_url_block to config;

add block and txid link to Overview, Receive, History page;

add Wallet Version, Transactions and Memory Pool Transactions to Overview page;

optimize Send, Receive, Address, History page;

remove account from Overview, Receive, Address, History page. Because the account feature of newbull/bitcoin core 0.14.2 have some issues;

remove wallet_path from config;

remove Home from navbar;

remove logo link from navbar;

change Overview to Wallet Overview

fix some known issues;

1.6.0 2021-09-30

Optimizes the behavior of the homepage to get many information;

Reduce the load on your wallet;

Greatly improves load speed and user experience;

1.5.0 2021-06-07

remove add account feature;

compatiable with 0.14.2;

add new theme: theme2;

add subtractfeefromamount;

1.4.0 2021-05-30

add http auth;

1.3.0 2021-05-22

add a new feature: fetch a new address with the specified prefix;

1.2.0 2020-12-18

addjust send page;

1.1.0 2019-12-13

add root_path in conf/config.php file;

fix wallet_path in conf/config.php file;

1.0.0 2019-02-19

refactor;

0.9.0 2019-02-17

fix bug;

0.8.0 2019-01-04

beautify;

0.7.0 2018-09-12

add send many & transfer account;

0.6.0 2018-07-21

add send page;

0.5.0 2018-07-04

add receive page;

0.4.0 2018-04-01

add address page;

0.3.0 2018-03-17

add history page;

0.2.0 2018-03-16

add accounts list;

0.1.0 2018-03-15

first release;
