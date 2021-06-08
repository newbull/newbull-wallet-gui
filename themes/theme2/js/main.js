function formatTimestampToDateTime(timestamp, format) {
	//formatTimestampToDateTime(new Date(), "yyyy-MM-dd hh:mm:ss.S")
	var timeObj = {
		"M": timestamp.getMonth() + 1,
		"d": timestamp.getDate(),
		"h": timestamp.getHours(),
		"m": timestamp.getMinutes(),
		"s": timestamp.getSeconds(),
		"q": Math.floor((timestamp.getMonth() + 3) / 3),
		"S": timestamp.getMilliseconds()
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (timestamp.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var key in timeObj) {
		if (new RegExp("(" + key + "+)").test(format)) {
			var value = "";
			if (RegExp.$1.length == 1) {
				value = timeObj[key];
			} else {
				value = ("00" + timeObj[key]).substr(("" + timeObj[key]).length);
			}
			format = format.replace(RegExp.$1, value);
		}
	}
	return format;
};

function GetRandomNum(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	return (Min + Math.round(Rand * Range));
}

function formatBlance(balance) {
	var str = balance.toString().split(".");
	var a = str[0];
	var b = str[1];
	if (a) {
		a = parseInt(a);
	}
	if (b) {
		b = "." + b;
	} else {
		b = "";
	}
	return a.toLocaleString() + b;
}

function playAudio(strArr) {
	var audiofile = '';
	var getArr = strArr.split(",");
	var type = navigator.appName
	if (type == "Netscape") {
		var lang = navigator.language
	} else {
		var lang = navigator.userLanguage
	}
	var lang = lang.substr(0, 2)
	switch (lang) {
		default:
		case 'en':
			audiofile = 'en/1/' + getArr[GetRandomNum(0, getArr.length - 1)];
			break;
	}

	var audio = new Audio(theme_path + "audio/" + audiofile + ".m4a");
	audio.play();
}

var audioFlag = 1;
var audioblockTime = 0;
var audioListtransactionsIndex = 0;

function get_wallet_info() {
	$.ajax({
		url: ajax_url,
		type: 'post',
		dataType: 'json',
		data: {
			action: "get_wallet_info"
		},
		success: function (data) {
			// console.log(data);
			if (data.s) {
				var obj = data;
				//lasttime = obj[0].timeline;
				//obj.reverse();
				//console.log(obj);
				$(".balance").text(formatBlance(obj.balance));
				$(".connections").text(obj.connections);
				$(".chain").text(obj.chain);

				if (obj.connections >= 1) {
					if (obj.generate) {
						$(".status").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>&nbsp;Mining...');
						//console.log(audioFlag);
						if (audioFlag != 1) {
							audioFlag = 1;
							playAudio('3');
						}
					} else {
						$(".status").html('<span class="spinner-border spinner-border-sm text-success" role="status" aria-hidden="true"></span>&nbsp;Synchronizing...');
						//console.log(audioFlag);
						if (audioFlag != 2) {
							audioFlag = 2;
							playAudio('2');
						}
					}
				} else {
					$(".status").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>&nbsp;Connecting...');
					//console.log(audioFlag);
					if (audioFlag != 3) {
						audioFlag = 3;
						playAudio('1');
					}
				}
				var listsinceblock = obj.listsinceblock.transactions;
				//console.log(listsinceblock);
				var immaturebalance = 0;
				$.each(listsinceblock, function (index) {
					//console.log(listsinceblock[index]);

					if (listsinceblock[index].category == 'immature') {
						immaturebalance += listsinceblock[index].amount;
					}
				});
				$(".unconfirmedbalance").text(formatBlance(obj.unconfirmedbalance + immaturebalance));
				$(".accounts").html('');
				var listaccounts = obj.listaccounts;
				// console.log(listaccounts);
				$.each(listaccounts, function (key, value) {
					// console.log(key + ": " + value);
					$('.accounts').append(
						'<tr>' +
						'<td>' + (key == "" ? "default" : key) + '</td>' +
						'<td class="amount">' + formatBlance(value) + " " + symbol + '</td>' +
						'</tr>'
					);
				});

				$('.transactions').html('');
				var listtransactions = obj.listtransactions;
				//console.log(listtransactions);
				$.each(listtransactions, function (index) {
					//console.log(listtransactions[index]);

					if (listtransactions[index].generated == true) {
						var categoryImg = 'img/icon/tx_mined.png';
					} else {
						switch (listtransactions[index].category) {
							case 'send':
								var categoryImg = 'img/icon/tx_output.png';
								break;
							case 'receive':
								var categoryImg = 'img/icon/tx_input.png';
								break;
							case 'move':
							default:
								var categoryImg = 'img/icon/tx_inout.png';
								break;
						}
					}
					//var unixTimestamp = new Date(listtransactions[index].time * 1000);
					//time = unixTimestamp.toLocaleString()

					if (listtransactions[index].category == 'receive') {
						//check first, or it will splice index0
						// if ($.inArray(listtransactions[index].address, obj.getaddressesbyaccount) != -1) {
						// 	obj.getaddressesbyaccount.splice($.inArray(listtransactions[index].address, obj.getaddressesbyaccount), 1);
						// }
						// var time = new Date(listtransactions[index].time * 1000).Format("yyyy-MM-dd hh:mm:ss");
						switch (true) {
							case listtransactions[index].confirmations >= 6:
								var confirmationsImg = 'img/icon/transaction2.png';
								break;
							case listtransactions[index].confirmations >= 5:
								var confirmationsImg = 'img/icon/clock5.png';
								break;
							case listtransactions[index].confirmations >= 4:
								var confirmationsImg = 'img/icon/clock4.png';
								break;
							case listtransactions[index].confirmations >= 3:
								var confirmationsImg = 'img/icon/clock3.png';
								break;
							case listtransactions[index].confirmations >= 2:
								var confirmationsImg = 'img/icon/clock2.png';
								break;
							default:
								var confirmationsImg = 'img/icon/clock1.png';
								break;
						}
					} else {
						switch (true) {
							case listtransactions[index].confirmations >= 100:
								var confirmationsImg = 'img/icon/transaction2.png';
								break;
							case listtransactions[index].confirmations >= 80:
								var confirmationsImg = 'img/icon/clock5.png';
								break;
							case listtransactions[index].confirmations >= 60:
								var confirmationsImg = 'img/icon/clock4.png';
								break;
							case listtransactions[index].confirmations >= 40:
								var confirmationsImg = 'img/icon/clock3.png';
								break;
							case listtransactions[index].confirmations >= 20:
								var confirmationsImg = 'img/icon/clock2.png';
								break;
							default:
								var confirmationsImg = 'img/icon/clock1.png';
								break;
						}
					}
					var amount = listtransactions[index].amount;
					if (amount > 0) {
						var amountClass = '';
						var amountSymbol = '+';
					} else {
						var amountClass = 'negative';
						var amountSymbol = '';
					}
					var td_account_address = "";
					if (listtransactions[index].category == 'move') {
						td_account_address = '<span style="color:blue;">' + (listtransactions[index].account == "" ? "default" : listtransactions[index].account) + "</span><br>" + (listtransactions[index].otheraccount == "" ? "default" : listtransactions[index].otheraccount);
					} else {
						td_account_address = '<span style="color:blue;">' + (listtransactions[index].account == "" ? "default" : listtransactions[index].account) + "</span><br>" + listtransactions[index].address;
					}
					$('.transactions').prepend(
						'<tr>' +
						'<td><img src="' + theme_path + categoryImg + '" width="36" height="36" /></td>' +
						'<td style="text-align:left;">' + td_account_address + '</td>' +
						'<td>' + formatTimestampToDateTime(new Date(listtransactions[index].time * 1000), "yyyy-MM-dd hh:mm:ss") + '</td>' +
						'<td>' + (listtransactions[index].confirmations ? '<img src="' + theme_path + confirmationsImg + '" width="24" height="24" />(' + listtransactions[index].confirmations + ')' : '<img src="' + theme_path + 'img/icon/transaction2.png" width="24" height="24" />') + '</td>' +
						'<td class="amount"><span class="' + amountClass + '">' + amountSymbol + formatBlance(amount) + '</span> ' + symbol + '</td>' +
						'</tr>'
					);
					audioListtransactionsIndex = index;
				});
				// console.log('audioListtransactionsIndex:' + audioListtransactionsIndex + ', audioblockTime:' + audioblockTime);
				if (!audioblockTime) {
					audioblockTime = listtransactions[audioListtransactionsIndex] ? listtransactions[audioListtransactionsIndex].time : 0;
					// console.log('init:' + audioblockTime);
				} else {
					if (audioblockTime != listtransactions[audioListtransactionsIndex].time) {
						// console.log(audioblockTime);
						audioblockTime = listtransactions[audioListtransactionsIndex].time;
						// console.log(audioblockTime);
						if (listtransactions[audioListtransactionsIndex].generated == true) {
							playAudio('4,5,6');
							// console.log('4,5,6');
						} else {
							if (listtransactions[audioListtransactionsIndex].amount > 0) {
								playAudio('7,8');
								// console.log('7,8');
							}
						}
					}
				}
			} else {
				// $(".balance").text();
				// $(".unconfirmedbalance").text('');
				$(".status").text(data.e);
				// $('table').html('');
			};
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			// $(".balance").text(textStatus);
			// $(".unconfirmedbalance").text('');
			$(".status").text(textStatus);
			// $('table').html('');
		},
		complete: function (XMLHttpRequest, textStatus) {

		}
	});
}

function get_history() {
	$.ajax({
		url: ajax_url,
		type: 'post',
		dataType: 'json',
		data: {
			action: "get_history"
		},
		success: function (data) {
			// console.log(data);
			if (data.s) {
				var listtransactions = data.listsinceblock.transactions;
				listtransactions.sort(function (a, b) {
					return a.time - b.time
				});
				$('.transactions').html('');
				$.each(listtransactions, function (index) {
					//console.log(listtransactions[index]);
					if (listtransactions[index].generated == true) {
						var categoryImg = 'img/icon/tx_mined.png';
					} else {
						switch (listtransactions[index].category) {
							case 'send':
								var categoryImg = 'img/icon/tx_output.png';
								break;
							case 'receive':
								var categoryImg = 'img/icon/tx_input.png';
								break;
							default:
								var categoryImg = 'img/icon/tx_inout.png';
								break;
						}
					}

					if (listtransactions[index].category == 'receive') {
						//check first, or it will splice index0
						// if ($.inArray(listtransactions[index].address, obj.getaddressesbyaccount) != -1) {
						// 	obj.getaddressesbyaccount.splice($.inArray(listtransactions[index].address, obj.getaddressesbyaccount), 1);
						// }
						switch (true) {
							case listtransactions[index].confirmations >= 6:
								var confirmationsImg = 'img/icon/transaction2.png';
								break;
							case listtransactions[index].confirmations >= 5:
								var confirmationsImg = 'img/icon/clock5.png';
								break;
							case listtransactions[index].confirmations >= 4:
								var confirmationsImg = 'img/icon/clock4.png';
								break;
							case listtransactions[index].confirmations >= 3:
								var confirmationsImg = 'img/icon/clock3.png';
								break;
							case listtransactions[index].confirmations >= 2:
								var confirmationsImg = 'img/icon/clock2.png';
								break;
							default:
								var confirmationsImg = 'img/icon/clock1.png';
								break;
						}
					} else {
						switch (true) {
							case listtransactions[index].confirmations >= 100:
								var confirmationsImg = 'img/icon/transaction2.png';
								break;
							case listtransactions[index].confirmations >= 80:
								var confirmationsImg = 'img/icon/clock5.png';
								break;
							case listtransactions[index].confirmations >= 60:
								var confirmationsImg = 'img/icon/clock4.png';
								break;
							case listtransactions[index].confirmations >= 40:
								var confirmationsImg = 'img/icon/clock3.png';
								break;
							case listtransactions[index].confirmations >= 20:
								var confirmationsImg = 'img/icon/clock2.png';
								break;
							default:
								var confirmationsImg = 'img/icon/clock1.png';
								break;
						}
					}
					var amount = listtransactions[index].amount;
					if (amount > 0) {
						var amountClass = '';
						var amountSymbol = '+';
					} else {
						var amountClass = 'negative';
						var amountSymbol = '';
					}

					$('.transactions').prepend(
						'<tr>' +
						'<td>' + (index + 1) + '</td>' +
						'<td><img src="' + theme_path + categoryImg + '" width="36" height="36" /></td>' +
						'<td style="text-align:left;"><span style="color:blue;">' + (listtransactions[index].account == "" ? "default" : listtransactions[index].account) + "</span><br>" + listtransactions[index].address + '</td>' +
						'<td>' + formatTimestampToDateTime(new Date(listtransactions[index].time * 1000), "yyyy-MM-dd hh:mm:ss") + '</td>' +
						'<td><img src="' + theme_path + confirmationsImg + '" width="24" height="24" />(' + listtransactions[index].confirmations + ')</td>' +
						'<td class="amount"><span class="' + amountClass + '">' + amountSymbol + formatBlance(amount) + '</span> ' + symbol + '</td>' +
						'</tr>'
					);
				});
			} else {
				$(".status").text(data.e);
			};
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$(".status").text(textStatus);
		},
		complete: function (XMLHttpRequest, textStatus) {

		}
	});
}

function get_receive() {
	$.ajax({
		url: ajax_url,
		type: 'post',
		dataType: 'json',
		data: {
			action: "get_receive"
		},
		success: function (data) {
			// console.log(data);
			if (data.s) {
				var listtransactions = data.listsinceblock.transactions;
				listtransactions.sort(function (a, b) {
					return a.time - b.time
				});
				$('.transactions').html('');
				$.each(listtransactions, function (index) {
					if (listtransactions[index].category == 'receive') {
						//check first, or it will splice index0
						// if ($.inArray(listtransactions[index].address, obj.getaddressesbyaccount) != -1) {
						// 	obj.getaddressesbyaccount.splice($.inArray(listtransactions[index].address, obj.getaddressesbyaccount), 1);
						// }
						switch (true) {
							case listtransactions[index].confirmations >= 6:
								var confirmationsImg = 'img/icon/transaction2.png';
								break;
							case listtransactions[index].confirmations >= 5:
								var confirmationsImg = 'img/icon/clock5.png';
								break;
							case listtransactions[index].confirmations >= 4:
								var confirmationsImg = 'img/icon/clock4.png';
								break;
							case listtransactions[index].confirmations >= 3:
								var confirmationsImg = 'img/icon/clock3.png';
								break;
							case listtransactions[index].confirmations >= 2:
								var confirmationsImg = 'img/icon/clock2.png';
								break;
							default:
								var confirmationsImg = 'img/icon/clock1.png';
								break;
						}
						var amount = listtransactions[index].amount;
						if (amount > 0) {
							var amountClass = '';
							var amountSymbol = '+';
						} else {
							var amountClass = 'negative';
							var amountSymbol = '';
						}

						$('.transactions').prepend(
							'<tr>' +
							'<td>' + (index + 1) + '</td>' +
							'<td style="text-align:left;"><span style="color:blue;">' + (listtransactions[index].account == "" ? "default" : listtransactions[index].account) + "</span><br>" + listtransactions[index].address + '</td>' +
							'<td>' + formatTimestampToDateTime(new Date(listtransactions[index].time * 1000), "yyyy-MM-dd hh:mm:ss") + '</td>' +
							'<td><img src="' + theme_path + confirmationsImg + '" width="24" height="24" />(' + listtransactions[index].confirmations + ')</td>' +
							'<td class="amount"><span class="' + amountClass + '">' + amountSymbol + formatBlance(amount) + '</span> ' + symbol + '</td>' +
							'</tr>'
						);
					}
				});
			} else {
				$(".status").text(data.e);
			};
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$(".status").text(textStatus);
		},
		complete: function (XMLHttpRequest, textStatus) {

		}
	});
}

function get_address() {
	$.ajax({
		url: ajax_url,
		type: 'post',
		dataType: 'json',
		data: {
			action: "get_address"
		},
		success: function (data) {
			// console.log(data);
			if (data.s) {
				$('.transactions').html('');
				$.each(data.getaddressesbyaccount_list, function (key, arr) {
					$.each(arr, function (index, value) {
						$('.transactions').append(
							'<tr>' +
							'<td>' + (index + 1) + '</td>' +
							'<td style="text-align:left;"><span style="color:blue;">' + (key == "" ? "default" : key) + "</span></td>" +
							'<td style="text-align:left;">' + value + '</td>' +
							'</tr>'
						);
					});
				});
			} else {
				$(".status").text(data.e);
			};
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$(".status").text(textStatus);
		},
		complete: function (XMLHttpRequest, textStatus) {

		}
	});
}

function get_send() {
	$.ajax({
		url: ajax_url,
		type: 'post',
		dataType: 'json',
		data: {
			action: "get_send"
		},
		success: function (data) {
			// console.log(data);
			if (data.s) {
				var listtransactions = data.listsinceblock.transactions;
				listtransactions.sort(function (a, b) {
					return a.time - b.time
				});
				$('.transactions').html('');
				$.each(listtransactions, function (index) {
					if (listtransactions[index].category == 'send') {
						//check first, or it will splice index0
						// if ($.inArray(listtransactions[index].address, obj.getaddressesbyaccount) != -1) {
						// 	obj.getaddressesbyaccount.splice($.inArray(listtransactions[index].address, obj.getaddressesbyaccount), 1);
						// }
						switch (true) {
							case listtransactions[index].confirmations >= 6:
								var confirmationsImg = 'img/icon/transaction2.png';
								break;
							case listtransactions[index].confirmations >= 5:
								var confirmationsImg = 'img/icon/clock5.png';
								break;
							case listtransactions[index].confirmations >= 4:
								var confirmationsImg = 'img/icon/clock4.png';
								break;
							case listtransactions[index].confirmations >= 3:
								var confirmationsImg = 'img/icon/clock3.png';
								break;
							case listtransactions[index].confirmations >= 2:
								var confirmationsImg = 'img/icon/clock2.png';
								break;
							default:
								var confirmationsImg = 'img/icon/clock1.png';
								break;
						}
						var amount = listtransactions[index].amount;
						if (amount > 0) {
							var amountClass = '';
							var amountSymbol = '+';
						} else {
							var amountClass = 'negative';
							var amountSymbol = '';
						}

						$('.transactions').prepend(
							'<tr>' +
							'<td>' + (index + 1) + '</td>' +
							'<td class="text-left">' + (listtransactions[index].address == undefined ? '' : listtransactions[index].address) +
							'<br>txid:<a href="' + explore_url_tx + listtransactions[index].txid + '" target="_blank">' + listtransactions[index].txid + '</a>' +
							'</td>' +
							'<td>' + formatTimestampToDateTime(new Date(listtransactions[index].time * 1000), "yyyy-MM-dd hh:mm:ss") + '</td>' +
							'<td><img src="' + theme_path + confirmationsImg + '" width="24" height="24" />(' + listtransactions[index].confirmations + ')</td>' +
							'<td class="amount"><span class="' + amountClass + '">' + amountSymbol + formatBlance(amount) + '</span> ' + symbol + '</td>' +
							'</tr>'
						);
					}
				});
			} else {
				$(".status").text(data.e);
			};
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$(".status").text(textStatus);
		},
		complete: function (XMLHttpRequest, textStatus) {

		}
	});
}

// function get_account_info() {
// 	$.ajax({
// 		url: ajax_url,
// 		type: 'post',
// 		dataType: 'json',
// 		data: {
// 			action: "get_account_info"
// 		},
// 		success: function (data) {
// 			// console.log(data);
// 			if (data.s) {
// 				var listaccounts = data.listaccounts;
// 				$.each(listaccounts, function (key, value) {
// 					$('.account').append(
// 						'<option value=' + key + '>' +
// 						key + ' (' + value + ')' +
// 						'</option>'
// 					);
// 				});
// 			} else {
// 				$("#sendtxid").text(data.e);
// 			};
// 		},
// 		error: function (XMLHttpRequest, textStatus, errorThrown) {
// 			$("#sendtxid").text(textStatus);
// 		},
// 		complete: function (XMLHttpRequest, textStatus) {

// 		}
// 	});
// }


function send_to_address(element) {
	var btn = $(element);
	var btn_text = btn.text();
	btn.attr('disabled', true);
	// aaa = element;
	// console.log(btn_text);
	// return;
	btn.html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbsp;Loading...');
	$("#sendtxid").css("display", "");
	// $("#sendtxid").removeClass().addClass("alert alert-info");

	if (!$('#address')[0].value || !$('#amount')[0].value) {
		$('#sendtxid').append('<div class="alert alert-danger" role="alert">error: empty</div>');
		// $("#sendtxid").removeClass().addClass("alert alert-danger");
		btn.text(btn_text);
		btn.attr('disabled', false);
		return;
	}
	//console.log($('#address')[0].value);
	//console.log($('#amount')[0].value);
	$.ajax({
		url: ajax_url,
		type: 'post',
		dataType: 'json',
		data: {
			action: "send_to_address",
			address: $('#address')[0].value,
			amount: $('#amount')[0].value,
			sffa: $('#subtract_fee_from_amount').prop('checked') ? 1 : 0,
		},
		success: function (data) {
			//console.log(data);
			if (data.s) {
				$('#sendtxid').append('<div class="alert alert-success" role="alert">' + data.sendtxid + '</div>');
				// $("#sendtxid").removeClass().addClass("alert alert-success");
				playAudio('9,10');
			} else {
				$('#sendtxid').append('<div class="alert alert-danger" role="alert">' + data.e + '</div>');
				// $("#sendtxid").removeClass().addClass("alert alert-danger");
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$('#sendtxid').append('<div class="alert alert-danger" role="alert">' + textStatus + '</div>');
			// $("#sendtxid").removeClass().addClass("alert alert-danger");
		},
		complete: function (XMLHttpRequest, textStatus) {
			btn.text(btn_text);
			btn.attr('disabled', false);
		}
	});
}

function send_to_address_direct(address, amount_min, amount_max) {
	if (!address || !amount_min || !amount_max) {
		return;
	}

	if (amount_min > amount_max) {
		var t = amount_max;
		amount_max = amount_min;
		amount_min = t;
	}

	var amount = Math.floor(Math.random() * amount_max + amount_min);

	$.ajax({
		url: ajax_url,
		type: 'post',
		dataType: 'json',
		data: {
			action: "send_to_address",
			address: address,
			amount: amount
		},
		success: function (data) {
			// console.log(data);
			if (data.s) {
				// playAudio('9,10');
			} else {
				console.log(data);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		},
		complete: function (XMLHttpRequest, textStatus) {}
	});
}

function send_many(element) {
	var btn = $(element);
	var btn_text = btn.text();
	btn.attr('disabled', true);
	// aaa = element;
	// console.log(btn_text);
	// return;
	btn.html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbsp;Loading...');

	// $("#sendtxid").html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbsp;Loading...');
	$("#sendtxid").css("display", "");
	// $("#sendtxid").removeClass().addClass("alert alert-info");
	if (!$('#send_many_address_amount')[0].value) {
		$('#sendtxid').append('<div class="alert alert-danger" role="alert">error: empty</div>');
		// $("#sendtxid").removeClass().addClass("alert alert-danger");
		btn.text(btn_text);
		btn.attr('disabled', false);
		return;
	}
	//console.log($('#address')[0].value);
	//console.log($('#amount')[0].value);
	var obj = {};
	var flag = true;
	$.each($('#send_many_address_amount')[0].value.split("\n"), function (index, value) {
		var arr = value.trim().split(":");
		if (arr.length >= 2) {
			obj[arr[0].trim() + ""] = arr[1].trim() * 1;
		} else {
			$('#sendtxid').append('<div class="alert alert-danger" role="alert">error: format invalid</div>');
			// $("#sendtxid").removeClass().addClass("alert alert-danger");
			btn.text(btn_text);
			btn.attr('disabled', false);
			flag = false;
			return;
		}
	});
	if (!flag) {
		return;
	}

	// console.log(obj);
	// return;
	$.ajax({
		url: ajax_url,
		type: 'post',
		dataType: 'json',
		data: {
			action: "send_many",
			// account: $('#send_many_account')[0].value,
			address_amount: JSON.stringify(obj),
			sffa: $('#send_many_subtract_fee_from_amount').prop('checked') ? 1 : 0,
		},
		success: function (data) {
			// console.log(data);
			if (data.s) {
				$('#sendtxid').append('<div class="alert alert-success" role="alert">' + data.sendtxid + '</div>');
				// $("#sendtxid").removeClass().addClass("alert alert-success");
				playAudio('9,10');
			} else {
				$('#sendtxid').append('<div class="alert alert-danger" role="alert">' + data.e + '</div>');
				// $("#sendtxid").removeClass().addClass("alert alert-danger");
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			// console.log(XMLHttpRequest, textStatus);
			$('#sendtxid').append('<div class="alert alert-danger" role="alert">' + textStatus + '</div>');
			// $("#sendtxid").removeClass().addClass("alert alert-danger");
		},
		complete: function (XMLHttpRequest, textStatus) {
			// console.log(XMLHttpRequest, textStatus);
			btn.text(btn_text);
			btn.attr('disabled', false);
		}
	});
}

function send_many_direct(str) {
	if (!str) {
		return;
	}

	var obj = {};
	$.each(str.trim().split("\n"), function (index, value) {
		var arr = value.trim().split(":");
		// console.log(arr);
		obj[arr[0].trim() + ""] = arr[1].trim() * 1;
	});
	// console.log(obj);
	// return;
	$.ajax({
		url: ajax_url,
		type: 'post',
		dataType: 'json',
		data: {
			action: "send_many",
			// account: "",
			address_amount: JSON.stringify(obj)
		},
		success: function (data) {
			// console.log(data);
			if (data.s) {
				// playAudio('9,10');
			} else {
				console.log(data);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest, textStatus);
			console.log(errorThrown);
		},
		complete: function (XMLHttpRequest, textStatus) {
			// console.log(XMLHttpRequest, textStatus);
		}
	});
}

// function move_to_account() {
// 	$("#sendtxid").html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbsp;Loading...');
// 	$("#sendtxid").css("display", "");
// 	$("#sendtxid").removeClass().addClass("alert alert-info");
// 	if ($('#move_to_account_from_account')[0].value == $('#move_to_account_to_account')[0].value) {
// 		$('#sendtxid').text('error: from account can not same as to account');
// 		$("#sendtxid").removeClass().addClass("alert alert-danger");
// 		return;
// 	}
// 	//console.log($('#address')[0].value);
// 	if (!$('#move_to_account_amount')[0].value) {
// 		$('#sendtxid').text('error: amount can not be empty');
// 		$("#sendtxid").removeClass().addClass("alert alert-danger");
// 		return;
// 	}
// 	$.ajax({
// 		url: ajax_url,
// 		type: 'post',
// 		dataType: 'json',
// 		data: {
// 			action: "move_to_account",
// 			from: $('#move_to_account_from_account')[0].value,
// 			to: $('#move_to_account_to_account')[0].value,
// 			amount: $('#move_to_account_amount')[0].value
// 		},
// 		success: function (data) {
// 			//console.log(data);
// 			if (data.s) {
// 				$('#sendtxid').text(data.sendtxid);
// 				$("#sendtxid").removeClass().addClass("alert alert-success");
// 				playAudio('9,10');
// 			} else {
// 				$('#sendtxid').text(data.e);
// 				$("#sendtxid").removeClass().addClass("alert alert-danger");
// 			}
// 		},
// 		error: function (XMLHttpRequest, textStatus, errorThrown) {
// 			//console.log(textStatus);
// 			$('#sendtxid').text(textStatus);
// 			$("#sendtxid").removeClass().addClass("alert alert-danger");
// 		},
// 		complete: function (XMLHttpRequest, textStatus) {
// 			//console.log(textStatus);
// 		}
// 	});
// }

function get_new_address(custom_prefix, str) {
	$("#newaddress_status").html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>&nbsp;Loading...');
	$("#newaddress_status").css("display", "");
	$("#newaddress_status").removeClass().addClass("alert alert-info");
	// var account_name = "";
	var address_prefix = "";
	var round = 0;
	if (custom_prefix) {
		// account_name = $('#account_1').val();
		address_prefix = "N" + $('#address').val();
		round = $('#round').val();
		if (round <= 0) {
			$("#newaddress_status").text("Round is 0, End");
			$("#newaddress_status").removeClass().addClass("alert alert-info");
			return;
		}
	} else {
		// account_name = $('#account').val();
	}

	$.ajax({
		url: ajax_url,
		type: 'post',
		dataType: 'json',
		data: {
			action: "get_new_address",
			// name: account_name,
		},
		success: function (data) {
			// console.log(data);
			if (data.s) {
				if (custom_prefix) {
					// send_to_address_direct(data.getnewaddress, 1, 10);
					var amount_min = 1;
					var amount_max = 10;
					var amount = Math.floor(Math.random() * amount_max + amount_min);
					str += data.getnewaddress + ":" + amount + "\n";
					var fetched_address_prefix = data.getnewaddress.substr(0, address_prefix.length);
					// console.log(fetched_address_prefix);
					// console.log(address_prefix);
					if (fetched_address_prefix == address_prefix) {
						$("#newaddress").css("display", "");
						$("#newaddress").append(data.getnewaddress + "<br>");
						$("#newaddress").removeClass().addClass("alert alert-success");
					} else {
						$("#newaddress_status").text(data.getnewaddress);
						// $("#newaddress_status").removeClass().addClass("alert alert-info");
					}
					if (round >= 500 && round % 500 == 0) {
						send_many_direct(str);
						str = "";
					}
					round--;
					if (round > 0) {
						$('#round').val(round);
						setTimeout(() => {
							get_new_address(custom_prefix, str);
						}, 10);
					} else {
						$("#newaddress_status").text("Round End");
						$("#newaddress_status").removeClass().addClass("alert alert-info");
						// console.log(str);
						send_many_direct(str);
					}
				} else {
					$("#newaddress").css("display", "");
					$("#newaddress").append(data.getnewaddress + "<br>");
					$("#newaddress").removeClass().addClass("alert alert-success");
					$("#newaddress_status").text("");
					$("#newaddress_status").css("display", "none");
				}
			} else {
				$("#newaddress_status").text(data.e);
				$("#newaddress_status").removeClass().addClass("alert alert-danger");
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$('#newaddress_status').html(textStatus);
			$("#newaddress_status").removeClass().addClass("alert alert-danger");
		},
		complete: function (XMLHttpRequest, textStatus) {

		}
	});
}