<?php
$version = '0.14.2.18';
define("IN_SCRIPT", true);

require_once 'conf/config.php';
require_once 'libs/functions.php';

// http auth
if (!$config['http_auth_username'] || !$config['http_auth_password']) {
    echo "http_auth_username and http_auth_password can not be empty.";
    exit;
}
function authenticate()
{
    header('WWW-Authenticate: Basic realm="' . $config['wallet_name'] . '"');
    header('HTTP/1.0 401 Unauthorized');
    echo "You must enter a valid login ID and password to access this resource\n";
    exit;
}
if (!isset($_SERVER['PHP_AUTH_USER'])) {
    authenticate();
} else {
    if ($_SERVER['PHP_AUTH_USER'] == $config['http_auth_username'] && $_SERVER['PHP_AUTH_PW'] == $config['http_auth_password']) {
        // auth pass
    } else {
        authenticate();
    }
}

//init url path prefix
$config["wallet_path"] = substr(str_replace(dirname(dirname(__FILE__)), "", __DIR__), 1) . "/";
if ($config["url_rewrite"]) {
    $name = isset($_GET['name']) ? $_GET['name'] : "";
    // list($url_param_get_action, $url_param_get_value) = explode("/", $name);
    $url_param_get_action = $name;
    $url_path["send"] = $config["root_path"] . $config["wallet_path"] . 'send';
    $url_path["receive"] = $config["root_path"] . $config["wallet_path"] . 'receive';
    $url_path["address"] = $config["root_path"] . $config["wallet_path"] . 'address';
    $url_path["history"] = $config["root_path"] . $config["wallet_path"] . 'history';
} else {
    $url_param_get_action = isset($_GET['action']) ? $_GET['action'] : "";
    // $url_param_get_value = isset($_GET['v']) ? $_GET['v'] : "";
    $url_path["send"] = $config["root_path"] . $config["wallet_path"] . '?action=send';
    $url_path["receive"] = $config["root_path"] . $config["wallet_path"] . '?action=receive';
    $url_path["address"] = $config["root_path"] . $config["wallet_path"] . '?action=address';
    $url_path["history"] = $config["root_path"] . $config["wallet_path"] . '?action=history';
}

switch ($url_param_get_action) {
    case "":
        $output["title"] = "";
        $output["description"] = $config["description"];
        $output["current_page"] = "";

        exit(get_html("index-body", $output));
        break;
    case "send":
        $output["title"] = "Send - ";
        $output["description"] = $config["description"];
        $output["current_page"] = "send";

        exit(get_html("send-body", $output));
        break;
    case "receive":
        $output["title"] = "Receive - ";
        $output["description"] = $config["description"];
        $output["current_page"] = "receive";

        exit(get_html("receive-body", $output));
        break;
    case "address":
        $output["title"] = "Address - ";
        $output["description"] = $config["description"];
        $output["current_page"] = "address";

        exit(get_html("address-body", $output));
        break;
    case "history":
        $output["title"] = "History - ";
        $output["description"] = $config["description"];
        $output["current_page"] = "history";

        exit(get_html("history-body", $output));
        break;
    default:
        send404();
        break;
}

function send404()
{
    global $config;
    // header('HTTP/1.1 404 Not Found');
    // header("status: 404 Not Found");
    http_response_code(404);
    $output["title"] = "Oops! 404 Not Found - ";
    $output["description"] = "Oops! 404 Not Found";

    exit(get_html("404", $output));
}

function html_replace_common($html)
{
    global $config, $version, $url_path;
    $common["name"] = $config["name"];
    $common["currency"] = $config["name"];
    $common["symbol"] = $config["symbol"];
    $common["wallet_name"] = $config["wallet_name"];
    $common["wallet_path"] = $config["wallet_path"];
    $common["theme_path"] = $config["root_path"] . $config["wallet_path"] . "themes/" . $config["theme"] . "/";
    $common["ajax_url"] = $config["root_path"] . $config["wallet_path"] . "ajax.php";
    $common["homepage"] = $config["homepage"];
    $common["root_path"] = $config["root_path"];
    $common["copy_name"] = $config["copy_name"];
    $common["start_year"] = $config["start_year"];
    $common["year"] = date("Y", time());
    $common["version"] = $version;
    $common["explore_url_block"] = $config["root_path"] . $config["explore_url_block"];
    $common["explore_url_tx"] = $config["root_path"] . $config["explore_url_tx"];

    return html_replace(html_replace($html, $url_path), $common);
}

function html_replace($html, $output)
{
    $keys = array();
    foreach ($output as $key => $value) {
        $keys[] = '{$' . $key . '}';
    }
    return str_replace(
        $keys,
        array_values($output),
        $html);
}

function get_html($filename, $output)
{
    global $config;
    $header = loadfile("themes/" . $config["theme"] . "/tpl/header.html");
    $body = loadfile("themes/" . $config["theme"] . "/tpl/" . $filename . ".html");
    $footer = loadfile("themes/" . $config["theme"] . "/tpl/footer.html");
    $html = $header . $body . $footer;
    $html = html_replace_common($html);
    $html = html_replace($html, $output);
    return clean_html($html);
}
exit;
