<?php
define("IN_SCRIPT", true);

require_once 'conf/config.php';
require_once 'libs/functions.php';
require_once 'libs/easybitcoin.php';

$bitcoinrpc = new Bitcoin($config["rpc_user"], $config["rpc_password"], $config["rpc_host"], $config["rpc_port"]);

$action = isset($_POST['action']) ? $_POST['action'] : "";
switch ($action) {
    case 'get_wallet_info':
        $getinfo = $bitcoinrpc->getinfo();
        $getmininginfo = $bitcoinrpc->getmininginfo();
        //$listsinceblock = $bitcoin->listsinceblock();
        //$getgenerate = $bitcoin->getgenerate();
        //$getconnectioncount = $bitcoin->getconnectioncount();
        //$listtransactions = $bitcoin->listtransactions("", 3, 0);

        //echo $bitcoin->response;
        //echo $bitcoin->raw_response;
        if ($bitcoinrpc->status == 200) {
            $data = array();
            $data['s'] = 1;
            $data['balance'] = $getinfo['balance'];
            $data['connections'] = $getinfo['connections'];
            $data['chain'] = $getmininginfo['chain'];
            $data['generate'] = $getmininginfo['generate'];
            $data['unconfirmedbalance'] = $bitcoinrpc->getunconfirmedbalance();
            $data['listsinceblock'] = $bitcoinrpc->listsinceblock();
            $data['listtransactions'] = $bitcoinrpc->listtransactions();
            $data['listaccounts'] = $bitcoinrpc->listaccounts();
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    case 'get_history':
    case 'get_send':
    case 'get_receive':
        $listsinceblock = $bitcoinrpc->listsinceblock();
        if ($bitcoinrpc->status == 200) {
            $data = array();
            $data['s'] = 1;
            $data['listsinceblock'] = $listsinceblock;
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    case 'get_address':
        $listaccounts = $bitcoinrpc->listaccounts();
        // $getaddressesbyaccount = array();
        $getaddressesbyaccount_list = array();
        foreach ($listaccounts as $key => $value) {
            $address = $bitcoinrpc->getaddressesbyaccount($key);
            // $getaddressesbyaccount += $address;
            $getaddressesbyaccount_list[$key] = $address;
        }
        if ($bitcoinrpc->status == 200) {
            $data = array();
            $data['s'] = 1;
            // $data['getaddressesbyaccount'] = $getaddressesbyaccount;
            $data['getaddressesbyaccount_list'] = $getaddressesbyaccount_list;
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    case 'get_account_info':
        $listaccounts = $bitcoinrpc->listaccounts();
        if ($bitcoinrpc->status == 200) {
            $data = array();
            $data['s'] = 1;
            $data['listaccounts'] = $listaccounts;
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    case 'send_to_address':
        $address = trim($_POST['address']);
        $amount = trim($_POST['amount']) * 1;
        $subtract_fee_from_amount = trim($_POST['sffa']);
        if ($subtract_fee_from_amount) {
            $sendtxid = $bitcoinrpc->sendtoaddress($address, $amount, '', '', true);
        } else {
            $sendtxid = $bitcoinrpc->sendtoaddress($address, $amount);
        }
        if ($bitcoinrpc->status == 200) {
            $data = array();
            $data['s'] = 1;
            $data['sendtxid'] = $sendtxid;
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    case 'send_many':
        // $account = trim($_POST['account']);
        $address_amount = trim($_POST['address_amount']);
        // $amount = trim($_POST['amount']) * 1;
        // $arr = json_decode($address_amount);
        // $arr1 = array();
        // foreach ($arr as $key => $value) {
        //     $arr1[$key] = $value * 1;
        // }
        // $data = array();
        // $data['status'] = 1;
        // $data['error'] = 0;
        // $data['sendtxid'] = json_decode($address_amount);
        // exit(json_encode($data));
        // exit($address_amount);

        $subtract_fee_from_amount = trim($_POST['sffa']);
        if ($subtract_fee_from_amount) {
            // "{\"1D1ZrZNe3JUo7ZycKEYQQiQAWd9y54F4XX\":0.01,\"1353tsE8YMTA4EuV7dgUXGjNFf9KpVvKHz\":0.02}" 1 "" "[\"1D1ZrZNe3J o7ZycKEYQQiQAWd9y54F4XX\",\"1353tsE8YMTA4EuV7dgUXGjNFf9KpVvKHz\"]"
            $subtract_fee_from_address = array();
            foreach (json_decode($address_amount, true) as $key => $value) {
                $subtract_fee_from_address[] = $key;
            }
            $sendtxid = $bitcoinrpc->sendmany("", json_decode($address_amount), 1, '', $subtract_fee_from_address);
        } else {
            $sendtxid = $bitcoinrpc->sendmany("", json_decode($address_amount));
        }
        if ($bitcoinrpc->status == 200) {
            $data = array();
            $data['s'] = 1;
            $data['sendtxid'] = $sendtxid;
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        // $data['sendtxid'] = json_encode($arr1);
        exit(json_encode($data));
        break;
    case 'move_to_account':
        $from = trim($_POST['from']);
        $to = trim($_POST['to']);
        $amount = trim($_POST['amount']) * 1;
        $sendtxid = $bitcoinrpc->move($from, $to, $amount);
        if ($bitcoinrpc->status == 200 && $sendtxid) {
            $data = array();
            $data['s'] = 1;
            $data['sendtxid'] = $sendtxid;
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    case 'get_new_address':
        // $name = $_POST["name"];
        // if ($name) {
        //     $getnewaddress = $bitcoinrpc->getnewaddress($name);
        // } else {
        $getnewaddress = $bitcoinrpc->getnewaddress();
        // }
        if ($bitcoinrpc->status == 200) {
            $data = array();
            $data['s'] = 1;
            $data['getnewaddress'] = $getnewaddress;
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    default:
        break;
}
exit;
