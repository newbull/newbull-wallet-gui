<?php
if (!defined('IN_SCRIPT')) {die('Invalid attempt!');}
$config = array(
    "name" => "NewBull", // Coin name/title
    "symbol" => "NB", // Coin symbol
    "description" => "You could browse and manage your NewBull wallet detail, send and receive coin with NewBull Wallet GUI.",
    "homepage" => "https://newbull.org/",
    "root_path" => "/", //start with '/', end with '/'
    "copy_name" => "newbull.org",
    "start_year" => 2016,
    "wallet_name" => "NewBull Wallet GUI",
    "wallet_path" => "wallet-gui-1.5.0/", //do not start with '/',  but end with '/', if root write ""
    "theme" => "theme2",
    "url_rewrite" => true,
    "rpc_host" => "127.0.0.1", // Host/IP for the daemon
    "rpc_port" => 10102, // RPC port for the daemon
    "rpc_user" => "newbull-rpc-user", // 'rpcuser' from the coin's .conf
    "rpc_password" => "newbull-rpc-password", // 'rpcpassword' from the coin's .conf
    "proofof" => "pow", //pow,pos
    "nTargetTimespan" => 1209600, //14 * 24 * 60 * 60
    "nTargetSpacing" => 180, //3 * 60
    "blocks_per_page" => 10,
    "date_format" => "Y-m-d H:i:s",
    "refresh_interval" => 180, //seconds
    "explore_url_tx" => "https://explorer.newbull.org/tx/",
    "http_auth_username" => "admin",
    "http_auth_password" => "123456",
);
