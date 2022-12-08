<?php
define("IN_SCRIPT", true);

require_once 'conf/config.php';
require_once 'libs/functions.php';
require_once 'libs/easybitcoin.php';

$bitcoinrpc = new Bitcoin($config["rpc_user"], $config["rpc_password"], $config["rpc_host"], $config["rpc_port"]);

$action = isset($_POST['action']) ? $_POST['action'] : "";
switch ($action) {
    case 'getinfo':
        $getinfo = $bitcoinrpc->getinfo();
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
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    case 'getmininginfo':
        $getmininginfo = $bitcoinrpc->getmininginfo();
        if ($bitcoinrpc->status == 200) {
            $data = array();
            $data['s'] = 1;
            $data['chain'] = $getmininginfo['chain'];
            $data['generate'] = $getmininginfo['generate'];
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    case 'getblockchaininfo':
        $getblockchaininfo = $bitcoinrpc->getblockchaininfo();
        if ($bitcoinrpc->status == 200) {
            $msg = "";
            $downloading = 0;
            if ($getblockchaininfo['blocks'] < $getblockchaininfo['headers']) {
                $msg = "Blocks downloading...";
                $downloading = 1;
            }
            $data = array();
            $data['s'] = 1;
            $data['chain'] = $getblockchaininfo['chain'];
            $data['blocks'] = $getblockchaininfo['blocks'];
            $data['headers'] = $getblockchaininfo['headers'];
            $data['mediantime'] = $getblockchaininfo['mediantime'];
            $data['downloading'] = $downloading;
            $data['msg'] = $msg;
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    case 'getwalletinfo':
        $getwalletinfo = $bitcoinrpc->getwalletinfo();
        if ($bitcoinrpc->status == 200) {
            $data = array();
            $data['s'] = 1;
            // $data['walletversion'] = $getwalletinfo['walletversion'];
            $data['unconfirmed_balance'] = $getwalletinfo['unconfirmed_balance'];
            $data['immature_balance'] = $getwalletinfo['immature_balance'];
            $data['txcount'] = $getwalletinfo['txcount'];
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    // case 'listsinceblock':
    //     $listsinceblock = $bitcoinrpc->listsinceblock();
    //     if ($bitcoinrpc->status == 200) {
    //         $transactions = $listsinceblock->transactions;
    //         $immaturebalance = 0;
    //         foreach ($transactions as $v) {
    //             if ($v->category == 'immature') {
    //                 $immaturebalance += $v->amount;
    //             }
    //         }
    //         $data = array();
    //         $data['s'] = 1;
    //         $data['immaturebalance'] = $immaturebalance;
    //         exit(json_encode($data));
    //     }
    //     $data = array();
    //     $data['s'] = 0;
    //     $data['e'] = $bitcoinrpc->error;
    //     exit(json_encode($data));
    //     break;
    case 'listtransactions':
        $listtransactions = $bitcoinrpc->listtransactions();
        if ($bitcoinrpc->status == 200) {
            $data = array();
            $data['s'] = 1;
            $data['listtransactions'] = $listtransactions;
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    case 'listmemorypooltransactions':
        //get address
        $listaccounts = $bitcoinrpc->listaccounts();
        if ($bitcoinrpc->status !== 200 && $bitcoinrpc->error !== '') {
            $data = array();
            $data['s'] = 0;
            $data['e'] = $bitcoinrpc->error;
            exit(json_encode($data));
        }
        // $getaddressesbyaccount = array();
        $getaddressesbyaccount_array = array();
        // $getaddressesbyaccount_list = array();
        foreach ($listaccounts as $key => $value) {
            $address_array = $bitcoinrpc->getaddressesbyaccount($key);
            if ($bitcoinrpc->status !== 200 && $bitcoinrpc->error !== '') {
                $data = array();
                $data['s'] = 0;
                $data['e'] = $bitcoinrpc->error;
                exit(json_encode($data));
            }
            // $getaddressesbyaccount += $address;
            // $getaddressesbyaccount_list[$key] = $address_array;
            // if ($key) {
            //     array_merge($getaddressesbyaccount_array, $address_array[$key]);
            // } else {
            // print_r($address_array);
            // array_merge($getaddressesbyaccount_array, $address_array);
            $getaddressesbyaccount_array += $address_array;
            // print_r($getaddressesbyaccount_array);
            // $a1 = array("a" => "red", "b" => "green");
            // $a2 = array("c" => "blue", "b" => "yellow");
            // print_r(array_merge($a1, $a2));
            //     foreach ($address_array as $k => $v) {
            //         print_r($v);
            //         array_merge($getaddressesbyaccount_array, $v);
            //     }
            // }
        }

        //get mem pool
        $listmemorypooltransactions = array();

        $getrawmempool = $bitcoinrpc->getrawmempool();
        if ($bitcoinrpc->status !== 200 && $bitcoinrpc->error !== '') {
            $data = array();
            $data['s'] = 0;
            $data['e'] = $bitcoinrpc->error;
            exit(json_encode($data));
        }
        foreach ($getrawmempool as $key => $tx) {
            $transaction_detail = array();
            $transaction_detail['tx'] = $tx;
            $rawtransaction = $bitcoinrpc->getrawtransaction($tx, 1);
            if ($rawtransaction === false) {
                continue;
            }

            $is_my_mempool = false;

            foreach ($rawtransaction['vout'] as $vout) {
                if ($vout['value'] > 0.0) {
                    $transaction_detail['vout'][$vout['n']]['addresses'] = $vout['scriptPubKey']['addresses'];
                    $transaction_detail['vout'][$vout['n']]['value'] = trim_dotzero($vout['value']);
                    // print_r($vout['scriptPubKey']['addresses']);
                    // echo "\n";
                    if (!$is_my_mempool) {
                        foreach ($vout['scriptPubKey']['addresses'] as $key => $address) {
                            if (in_array($address, $getaddressesbyaccount_array)) {
                                $is_my_mempool = true;
                            }
                        }
                    }
                }
            }
            if ($is_my_mempool) {
                $listmemorypooltransactions[] = $transaction_detail;
            }
        }

        $data = array();
        $data['s'] = 1;
        // $data['listaccounts'] = $listaccounts;
        // $data['getaddressesbyaccount_list'] = $getaddressesbyaccount_list;
        // $data['getaddressesbyaccount_array'] = $getaddressesbyaccount_array;
        $data['listmemorypooltransactions'] = $listmemorypooltransactions;
        // print_r($data);
        exit(json_encode($data));
        break;
    case 'listaccounts':
        $listaccounts = $bitcoinrpc->listaccounts();
        if ($bitcoinrpc->status == 200) {
            $data = array();
            $data['s'] = 1;
            $data['listaccounts'] = $bitcoinrpc->listaccounts();
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    case 'get_history':
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
    case 'get_send':
        $listsinceblock = $bitcoinrpc->listsinceblock();
        if ($bitcoinrpc->status == 200) {
            $transactions = array();
            foreach ($listsinceblock['transactions'] as $key => $value) {
                if ($value['category'] == 'send') {
                    $transactions[] = $value;
                }
            }
            $data = array();
            $data['s'] = 1;
            $data['transactions'] = $transactions;
            // $data['listsinceblock'] = $listsinceblock;
            exit(json_encode($data));
        }
        $data = array();
        $data['s'] = 0;
        $data['e'] = $bitcoinrpc->error;
        exit(json_encode($data));
        break;
    case 'get_receive':
        $listsinceblock = $bitcoinrpc->listsinceblock();
        if ($bitcoinrpc->status == 200) {
            $transactions = array();
            foreach ($listsinceblock['transactions'] as $key => $value) {
                if ($value['category'] == 'receive') {
                    $transactions[] = $value;
                }
            }
            $data = array();
            $data['s'] = 1;
            $data['transactions'] = $transactions;
            // $data['listsinceblock'] = $listsinceblock;
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
