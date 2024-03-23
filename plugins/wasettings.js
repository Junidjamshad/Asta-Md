let Asta_Md = "Asta"
let {smd , prefix,Config} = require("../lib")
const moment = require("moment-timezone");
let {
  fancytext,
  tlang,
  tiny,
  botpic,
  updateProfilePicture,
  parsedJid
} = require("../lib");
const {
	cmd
  } = require("../lib/plugins");
const long = String.fromCharCode(8206);
const readmore = long.repeat(4001);
smd({
	pattern: 'clear',
	fromMe: true,
	alias: ["clear", "clearchat"],
	desc: 'delete whatsapp chat',
	type: 'whatsapp settings'
}, async (message, match) => { 
    try{   
	await message.bot.chatModify({
                
		delete: true,
		lastMessages: [{
			key: message.key,
			messageTimestamp: message.messageTimestamp
		}]
	}, message.jid)

	await message.send('_Cleared!_')
    }catch(e){ message.error(`${e}\n\nCommand : clear` , e, false) }
})
smd({
	pattern: 'archive',
	fromMe: true,
	alias: ["archive", "archivechat"],
	desc: 'archive whatsapp chat',
	type: 'whatsapp settings'
}, async (message, match) => {
    try{
	const lstMsg = {
		message: message.message,
		key: message.key,
		messageTimestamp: message.messageTimestamp
	};
	await message.bot.chatModify({
		archive: true,
		lastMessages: [lstMsg]
	}, message.jid);
	await message.send('_Archived_')
}catch(e){ message.error(`${e}\n\nCommand : archive` , e, false) }
})
smd({
	pattern: 'unarchive',
	fromMe: true,
	alias: ["unarchive", "unarchivechat"],
	desc: 'unarchive whatsapp chat',
	type: 'whatsapp settings'
}, async (message, match) => {
    try{
	const lstMsg = {
		message: message.message,
		key: message.key,
		messageTimestamp: message.messageTimestamp
	};
	await message.bot.chatModify({
		archive: false,
		lastMessages: [lstMsg]
	}, message.jid);
	await message.send('_Unarchived_')
}catch(e){ message.error(`${e}\n\nCommand : unarchive` , e, false) }
})
smd({
	pattern: 'pin',
  alias :["pinchat", "pin"],
	fromMe: true,
	desc: 'pin a chat',
	type: 'whatsapp settings'
}, async (message, match) => {
    try{
	await message.bot.chatModify({
		pin: true
	}, message.jid);
	await message.send('_Pined_')
}catch(e){ message.error(`${e}\n\nCommand : chatpin` , e, false) }
})
smd({
	pattern: 'unpin',
  alias :["unpinchat","unpin","chatunpin"],
	fromMe: true,
	desc: 'unpin a msg',
	type: 'whatsapp settings'
}, async (message, match) => {
    try{
	await message.bot.chatModify({
		pin: false
	}, message.jid);
	await message.send('_Unpined_')
}catch(e){ message.error(`${e}\n\nCommand : unpin` , e, false) }
})
smd({
	pattern: 'read',
	fromMe: true,
	alias: ["read", "markread"],
	desc: 'mark as readed',
	type: 'whatsapp settings'
}, async (message, match) => {

    try{
  let msg = await message.react("🍁")
	await message.bot.chatModify(
		{ markRead: true, lastMessages: [message] }, 
    message.jid
    );
    }catch(e){ message.error(`${e}\n\nCommand : markread` , e, false) }
})
smd({
	pattern: 'unread',  
	fromMe: true,
	alias: ["unread", "markunread"],
	desc: 'mark as UnRead',
	type: 'whatsapp settings'
}, async (message, match) => {

    try{
  let msg = await message.send("🍁",{},"react")
  console.log({msg})
	await message.bot.chatModify(
		{ markRead: false, lastMessages: [message] }, 
    message.jid
    );
    }catch(e){ message.error(`${e}\n\nCommand : markunread` , e, false) }
})

smd({
	pattern: 'chatunmute',
	alias: ["unmutechat", "unmutec"],
	fromMe: true,
	desc: 'unmute a chat',
	type: 'whatsapp settings'
}, async (message, match) => {
    try{
	await message.bot.chatModify( { mute: null }, message.jid );
	await message.send('_Chat Unmuted!_')
}catch(e){ message.error(`${e}\n\nCommand : unmutechat` , e, false) }

})

smd({
	pattern: 'name',
	fromMe: true,
	alias: ["name", "profilename", "proname", "pname"],
	desc: 'To change your profile name',
	type: 'whatsapp'
}, async (message, match) => {
    try{
	match = match || message.reply_message.text
	if (!match) return await message.send('*Need Name!*\n*Example: profilename your name*.')
	await message.bot.updateProfileName(match)
	await message.send('_Profile name updated!_')
}catch(e){ message.error(`${e}\n\nCommand : profilename` , e, false) }
})

smd({
	pattern: 'wasettings',
	fromMe: true,
	alias: ["wasettings", "wasetting", "settingswa", "privacy"],
	desc: 'get your privacy settings',
	type: 'privacy'
}, async (message, match) => {
	const {
		readreceipts,
		profile,
		status,
		online,
		last,
		groupadd,
		calladd
	} = await message.bot.fetchPrivacySettings(true);
	const msg = `*♺ whatsapp settings*

*ᝄ name :* ${(message.fromMe &&  message.pushName ? message.pushName :  message.bot.user.name).split("\n").join("  ") }
*ᝄ number :* ${message.user.split("@")[0]}

*ᝄ online :* ${online}
*ᝄ profile :* ${profile}
*ᝄ last seen :* ${last}
*ᝄ whts status :* ${status}
*ᝄ read receipt :* ${readreceipts}

*ᝄ who can add in group :* ${groupadd}
*ᝄ who can call :* ${calladd}`;
	let img = await message.getpp(message.user)
	await message.send(img, {
		caption: msg
	}, 'img');
})

smd({
	pattern: 'lastseen-mode',
	fromMe: true,
	alias: ["lastseen"],
	desc: 'to change lastseen privacy',
	type: 'privacy'
}, async (message, match, {smd }) => {
    try{
	if (!match) return await message.send(`_*Example:-* .lastseen all_\n_to change last seen privacy settings_`);
	const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
	if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join(' / ')}* values_`);
	await message.bot.updateLastSeenPrivacy(match)
	await message.send(`_Privacy settings *last seen* Updated to *${match}*_`);
}catch(e){ message.error(`${e}\n\nCommand : lastseen` , e, false) }
})


smd({
	pattern: 'online-mode',
	fromMe: true,
	alias: ["onlinemode", "online", "online-mode"],
	desc: 'to change online privacy',
	type: 'privacy'
}, async (message, match,) => {
    try{
	if (!match) return await message.send(`_*Example:-* .online all_\n_to change *online*  privacy settings_`);
	const available_privacy = ['all', 'match_last_seen'];
	if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`);
	await message.bot.updateOnlinePrivacy(match)
	await message.send(`_Privacy Updated to *${match}*_`);
}catch(e){ message.error(`${e}\n\nCommand : online` , e, false) }
})


smd({
	pattern: 'set-mypp',
	fromMe: true,
	alias: ["dp","set-mypp", "pp", "profilepic", "wadp"],
	desc: 'privacy setting profile picture',
	type: 'privacy'
}, async (message, match) => {
    try{
	if (!match) return await message.send(`_*Example:-* .mypp all_\n_to change *profile picture*  privacy settings_`);
	const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
	if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`);
	await message.bot.updateProfilePicturePrivacy(match)
	await message.send(`_Privacy Updated to *${match}*_`);
}catch(e){ message.error(`${e}\n\nCommand : mypp` , e, false) }
})

smd({
	pattern: 'set-mystatus',
	fromMe: true,
	alias: ["mystatus","set-mystatus", "status"],
	desc: 'privacy for my status',
	type: 'privacy'
}, async (message, match,) => {
    try{
	if (!match) return await message.send(`_*Example:-* .mystatus all_\n_to change *status*  privacy settings_`);
	const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
	if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`);
	await message.bot.updateStatusPrivacy(match)
	await message.send(`_Privacy Updated to *${match}*_`);
}catch(e){ message.error(`${e}\n\nCommand : mystatus` , e, false) }
})

smd({
	pattern: 'readmsgs',
	fromMe: true,
	alias: ["readmmsgs"],
	desc: 'privacy for read message',
	type: 'privacy'
}, async (message, match, smd) => {
    try{
	if (!match) return await message.send(`*Example:-* .read all`);
	const available_privacy = ['all', 'none'];
	if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`);
	await message.bot.updateReadReceiptsPrivacy(match)
	await message.send(`_Privacy Updated to *${match}*_`);
}catch(e){ message.error(`${e}\n\nCommand : read` , e, false) }
})

smd({
	pattern: 'set-groupadd',
	fromMe: true,
	alias: ["groupadd","set-groupadd", "gcadd"],
	desc: 'privacy for group add',
	type: 'privacy'
}, async (message, match, smd) => {
    try{
	if (!match) return await message.send(`*Example:-* .groupadd 'all', 'contacts', 'contact_blacklist', 'none'`);
	const available_privacy = ['all', 'contacts', 'contact_blacklist', 'none'];
	if (!available_privacy.includes(match)) return await message.send(`_action must be *${available_privacy.join('/')}* values_`);
	await message.bot.updateGroupsAddPrivacy(match)
	await message.send(`_Privacy Updated to *${match}*_`);
}catch(e){ message.error(`${e}\n\nCommand : groupadd` , e, false) }
})
cmd(
	{
	  pattern: "privacysettings",
	  desc: "send ptv Message of video",
	  category: "whatsapp",
	  filename: __filename,
	},
	async (message, _, { cmdName }) => {
	  try {
		const privacySettings = await message.bot.fetchPrivacySettings();
  
		const text = `*[WHATSAPP PRIVACY SETTINGS]*\n\n*PROFILE:* ${privacySettings.profile}\n*STATUS:* ${privacySettings.status}\n*ONLINE:* ${privacySettings.online}\n*LASTSEEN:* ${privacySettings.last}\n*MESSAGE READ:* ${privacySettings.readreceipts}\n\n*Who can add in group:* ${privacySettings.groupadd}\n*Who can call:* ${privacySettings.calladd}\n `;
  
		await message.send(text);
	  } catch (error) {
		await message.error(`${error}\n\ncommand : ${cmdName}`, error);
	  }
	}
  );
  let mtypes = ["imageMessage"];
  smd(
	{
	  pattern: "pp",
	  desc: "Set profile picture",
	  category: "whatsapp",
	  use: "<reply to image>",
	  fromMe: true,
	  filename: __filename,
	},
	async (message) => {
	  try {
		let replyMessage =
		  mtypes.includes(message.mtype)
			? message
			: message.reply_message;
  
		if (!replyMessage || !mtypes.includes(replyMessage?.mtype || "need_Media")) {
		  return await message.reply("*Reply to an image, dear*");
		}
  
		return await updateProfilePicture(message, message.user, replyMessage, "pp");
	  } catch (error) {
		await message.error(`${error}\n\ncommand : pp`, error);
	  }
	}
  );
  
  smd(
	{
	  pattern: "fullpp",
	  desc: "Set full screen profile picture",
	  category: "whatsapp",
	  use: "<reply to image>",
	  fromMe: true,
	  filename: __filename,
	},
	async (message) => {
	  try {
		let replyMessage =
		  mtypes.includes(message.mtype)
			? message
			: message.reply_message;
  
		if (!replyMessage || !mtypes.includes(replyMessage?.mtype || "need_Media")) {
		  return await message.reply("*Reply to an image, dear*");
		}
  
		return await updateProfilePicture(message, message.user, replyMessage, "fullpp");
	  } catch (error) {
		await message.error(`${error}\n\ncommand : fullpp`, error);
	  }
	}
  );
  
  smd(
	{
	  pattern: "rpp",
	  desc: "remove profile picture",
	  category: "whatsapp",
	  use: "<chat>",
	  fromMe: true,
	  filename: __filename,
	},
	async (message) => {
	  try {
		await message.removepp();
		message.send("*_Profile picture removed successfully!_*");
	  } catch (error) {
		await message.error(`${error}\n\ncommand : rpp`, error);
	  }
	}
  );
  
  smd(
	{
	  pattern: "bio",
	  desc: "update profile status of whatsapp",
	  category: "whatsapp",
	  use: "<text>",
	  fromMe: true,
	  filename: __filename,
	},
	async (message, text) => {
	  try {
		if (!text) {
		  return await message.send(
			`*_provide text to update profile status!_*\n*_Example: ${prefix}bio Suhail Md_*`
		  );
		}
  
		await message.bot.updateProfileStatus(text);
		message.send("*Profile status updated successfully!*");
	  } catch (error) {
		await message.error(`${error}\n\ncommand : bio`, error);
	  }
	}
  );
  cmd({
	pattern: "ptv",
	desc: "send ptv Message of video",
	category: "whatsapp",
	filename: __filename
  }, async (_0x3c447b, _0x380c98, {
	cmdName: _0x1cc2ce
  }) => {
	try {
	  if (!_0x3c447b.quoted) {
		return await _0x3c447b.send("*Uhh Please, reply to video*");
	  }
	  let _0x3e5787 = _0x3c447b.quoted.mtype;
	  if (_0x3e5787 !== "videoMessage") {
		return await _0x3c447b.send("*Uhh Dear, reply to a video message*");
	  }
	  return await _0x3c447b.bot.forwardOrBroadCast2(_0x3c447b.chat, _0x3c447b.quoted, {}, _0x1cc2ce);
	} catch (_0xdce52f) {
	  await _0x3c447b.error(_0xdce52f + "\n\ncommand : ptv", _0xdce52f);
	}
  });
  cmd({
	pattern: "save",
	desc: "Save Message to log number",
	category: "whatsapp",
	filename: __filename
  }, async (_0x3516c9, _0x59b822, {
	cmdName: _0xc432b
  }) => {
	try {
	  let _0x575bb6 = _0x3516c9.reply_message;
	  if (!_0x575bb6) {
		return await _0x3516c9.send("*Uhh Please, reply to to a Message*");
	  }
	  let _0x5ac877 = await _0x3516c9.bot.forwardOrBroadCast(_0x3516c9.user, _0x575bb6);
	} catch (_0x311f45) {
	  await _0x3516c9.error(_0x311f45 + "\n\ncommand : save", _0x311f45);
	}
  });
  cmd({
	pattern: "quoted",
	desc: "get reply Message from Replied Message",
	category: "user",
	filename: __filename
  }, async _0x362f3c => {
	try {
	  if (!_0x362f3c.quoted) {
		return await _0x362f3c.send("*_Uhh Dear, Reply to a Message_*");
	  }
	  var _0x42e5cf = await _0x362f3c.bot.serializeM(await _0x362f3c.getQuotedObj());
	  if (!_0x42e5cf || !_0x42e5cf.quoted) {
		return await _0x362f3c.replay("*Message you replied does not contain a reply Message*");
	  }
	  try {
		await _0x362f3c.react("✨", _0x362f3c);
		let _0x1d5680 = await _0x362f3c.bot.serializeM(await _0x42e5cf.getQuotedObj());
		return await _0x362f3c.bot.copyNForward(_0x362f3c.chat, _0x1d5680, false);
	  } catch (_0x34eaa6) {
		await _0x362f3c.bot.forward(_0x362f3c.chat, _0x42e5cf.quoted, {}, _0x362f3c);
		console.log(_0x34eaa6);
	  }
	} catch (_0x512af7) {
	  await _0x362f3c.error(_0x512af7 + "\n\ncommand : quoted", _0x512af7);
	}
  });
  cmd({
	pattern: "blocklist",
	desc: "get list of all Blocked Numbers",
	category: "whatsapp",
	fromMe: true,
	filename: __filename,
	use: "<text>"
  }, async _0xfa0e7f => {
	try {
	  const _0x4bd729 = await _0xfa0e7f.bot.fetchBlocklist();
	  if (_0x4bd729.length === 0) {
		return await _0xfa0e7f.reply("Uhh Dear, You don't have any Blocked Numbers.");
	  }
	  let _0x5749d5 = "\n*≡ List*\n\n*_Total Users:* " + _0x4bd729.length + "_\n\n┌─⊷ \t*BLOCKED USERS*\n";
	  for (let _0x2cd015 = 0; _0x2cd015 < _0x4bd729.length; _0x2cd015++) {
		_0x5749d5 += "▢ " + (_0x2cd015 + 1) + ":- wa.me/" + _0x4bd729[_0x2cd015].split("@")[0] + "\n";
	  }
	  _0x5749d5 += "└───────────";
	  return await _0xfa0e7f.bot.sendMessage(_0xfa0e7f.chat, {
		text: _0x5749d5
	  });
	} catch (_0x1ed9b4) {
	  await _0xfa0e7f.error(_0x1ed9b4 + "\n\ncommand : blocklist", _0x1ed9b4);
	}
  });
  cmd({
	pattern: "location",
	desc: "Adds *readmore* in given text.",
	category: "whatsapp",
	filename: __filename
  }, async (_0x4ee956, _0x22e2dc) => {
	try {
	  if (!_0x22e2dc) {
		return await _0x4ee956.reply("*Give Coordinates To Send Location!*\n *Ex: " + prefix + "location 24.121231,55.1121221*");
	  }
	  let _0x23101b = parseFloat(_0x22e2dc.split(",")[0]) || "";
	  let _0x4b8436 = parseFloat(_0x22e2dc.split(",")[1]) || "";
	  if (!_0x23101b || isNaN(_0x23101b) || !_0x4b8436 || isNaN(_0x4b8436)) {
		return await _0x4ee956.reply("*_Cordinates Not In Formate, Try Again_*");
	  }
	  await _0x4ee956.reply("*----------LOCATION------------*\n```Sending Location Of Given Data:\n Latitude: " + _0x23101b + "\n Longitude: " + _0x4b8436 + "```\n\n" + Config.caption);
	  return await _0x4ee956.sendMessage(_0x4ee956.jid, {
		location: {
		  degreesLatitude: _0x23101b,
		  degreesLongitude: _0x4b8436
		}
	  }, {
		quoted: _0x4ee956
	  });
	} catch (_0x4d92d0) {
	  await _0x4ee956.error(_0x4d92d0 + "\n\ncommand : location", _0x4d92d0);
	}
  });
  smd({
	pattern: "listpc",
	category: "whatsapp",
	desc: "Finds info about personal chats",
	filename: __filename
  }, async (_0x144fd0, _0x21857a, {
	store: _0x563c73
  }) => {
	try {
	  _0x144fd0.react("🫡");
	  let _0x196bf6 = await _0x563c73.chats.all().filter(_0x8b2b5 => _0x8b2b5.id.endsWith(".net")).map(_0x434198 => _0x434198);
	  let _0x4b7ff3 = " 「  " + Config.botname + "'s pm user list  」\n\nTotal " + _0x196bf6.length + " users are text in personal chat.";
	  for (let _0x15740d of _0x196bf6) {
		_0x4b7ff3 += "\n\nUser: @" + _0x15740d.id.split("@")[0] + "\nMessages : " + _0x15740d.unreadCount + "\nLastchat : " + moment(_0x15740d.conversationTimestamp * 1000).tz(timezone).format("DD/MM/YYYY HH:mm:ss");
	  }
	  _0x144fd0.bot.sendTextWithMentions(_0x144fd0.chat, _0x4b7ff3, _0x144fd0);
	} catch (_0x170045) {
	  return await _0x144fd0.error(_0x170045 + "\n\n command: listpc", _0x170045, "*_Didn't get any results, Sorry!_*");
	}
  });
  smd({
	pattern: "listgc",
	category: "whatsapp",
	desc: "Finds info about all active groups",
	filename: __filename
  }, async (_0xa220f, _0x123a92, {
	store: _0x4ff3e9,
	Void: _0x573654
  }) => {
	try {
	  _0xa220f.react("🫡");
	  let _0x369bef = await _0x4ff3e9.chats.all().filter(_0x17a722 => _0x17a722.id.endsWith("@g.us")).map(_0x2555de => _0x2555de);
	  let _0x162811 = " 「  " + Config.botname + "'s group user list  」\n\nTotal " + _0x369bef.length + " active Groups found!";
	  for (let _0x37fd61 of _0x369bef) {
		let _0x10ff83 = await _0x573654.groupMetadata(_0x37fd61.id);
		_0x162811 += "\n\nName : " + _0x10ff83.subject + " " + (_0x10ff83.owner ? "\nOwner : @" + _0x10ff83.owner.split("@")[0] : "") + "\nID : " + _0x37fd61.id + "\nMade : " + (_0x10ff83.creation ? moment(_0x10ff83.creation * 1000).tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm:ss") : _0x10ff83.creation) + "\nMember : " + (_0x10ff83.participants.length || 0) + "\n\nMessages : " + _0x37fd61.unreadCount + "\nLastchat : " + moment(_0x37fd61.conversationTimestamp * 1000).tz(timezone).format("DD/MM/YYYY HH:mm:ss");
	  }
	  _0xa220f.send(_0x162811, {}, "suhail", _0xa220f);
	} catch (_0x383d75) {
	  return await _0xa220f.error(_0x383d75 + "\n\n command: listpc", _0x383d75, "*_Didn't get any results, Sorry!_*");
	}
  });
  cmd({
	pattern: "vcard",
	desc: "Create Contact by given name.",
	category: "whatsapp",
	filename: __filename
  }, async (_0x2721c0, _0x4a39c4) => {
	try {
	  if (!_0x2721c0.quoted) {
		return _0x2721c0.reply("*Please Reply to User With Name*");
	  }
	  if (!_0x4a39c4) {
		return _0x2721c0.reply("Please Give Me User Name, \n *Example : " + prefix + "vcard Suhail Tech Info* ");
	  }
	  var _0x96de1e = _0x4a39c4.split(" ");
	  if (_0x96de1e.length > 3) {
		_0x4a39c4 = _0x96de1e.slice(0, 3).join(" ");
	  }
	  const _0x4ef0e2 = "BEGIN:VCARD\nVERSION:3.0\nFN:" + _0x4a39c4 + "\nORG:;\nTEL;type=CELL;type=VOICE;waid=" + _0x2721c0.quoted.sender.split("@")[0] + ":+" + owner[0] + "\nEND:VCARD";
	  let _0x2438e1 = {
		contacts: {
		  displayName: _0x4a39c4,
		  contacts: [{
			vcard: _0x4ef0e2
		  }]
		}
	  };
	  return await _0x2721c0.bot.sendMessage(_0x2721c0.chat, _0x2438e1, {
		quoted: _0x2721c0
	  });
	} catch (_0x4812de) {
	  await _0x2721c0.error(_0x4812de + "\n\ncommand : vcard", _0x4812de);
	}
  });
  smd({
	pattern: "edit",
	fromMe: true,
	desc: "edit message that sended by bot",
	type: "whatsapp"
  }, async (_0x248e32, _0x36d92f) => {
	try {
	  let _0x38f991 = _0x248e32.reply_message && _0x248e32.reply_message.fromMe ? _0x248e32.reply_message : false;
	  if (!_0x38f991) {
		return await _0x248e32.reply("_Reply to a message that sent by you!_");
	  }
	  if (!_0x36d92f) {
		return await _0x248e32.reply("_Need text, Example: edit hi_");
	  }
	  return await _0x248e32.edit(_0x36d92f, {
		edit: _0x38f991
	  });
	} catch (_0x1ebf78) {
	  await _0x248e32.error(_0x1ebf78 + "\n\ncommand : edit", _0x1ebf78);
	}
  });
  smd({
	pattern: "forward",
	alias: ["send"],
	desc: "forward your messages in your jid",
	type: "whatsapp"
  }, async (_0x33c3ba, _0xc4c33d) => {
	try {
	  if (!_0x33c3ba.reply_message) {
		return _0x33c3ba.reply("*_Reply to something!_*");
	  }
	  let _0x336179 = await parsedJid(_0xc4c33d);
	  if (!_0xc4c33d || !_0x336179 || !_0x336179[0]) {
		return await _0x33c3ba.send("*Provide jid to forward message*\n*use _" + prefix + "jid,_ to get jid of users!*");
	  }
	  for (let _0xcd7afa = 0; _0xcd7afa < _0x336179.length; _0xcd7afa++) {
		_0x33c3ba.bot.forwardOrBroadCast(_0x336179[_0xcd7afa], _0x33c3ba.reply_message);
	  }
	} catch (_0x5c2093) {
	  await _0x33c3ba.error(_0x5c2093 + "\n\ncommand : forward", _0x5c2093);
	}
  });
  smd({
	cmdname: "block",
	info: "blocks a person",
	fromMe: true,
	type: "whatsapp",
	filename: __filename,
	use: "<quote/reply user.>"
  }, async _0x51ddfa => {
	try {
	  let _0x237c49 = _0x51ddfa.reply_message ? _0x51ddfa.reply_message.sender : !_0x51ddfa.isGroup ? _0x51ddfa.from : _0x51ddfa.mentionedJid[0] ? _0x51ddfa.mentionedJid[0] : "";
	  if (!_0x237c49 && !_0x237c49.includes("@s.whatsapp.net")) {
		return await _0x51ddfa.reply("*Uhh dear, reply/mention an User*");
	  }
	  if (_0x51ddfa.checkBot(_0x237c49)) {
		return await _0x51ddfa.reply("*Huh, I can't block my Creator!!*");
	  }
	  await _0x51ddfa.bot.updateBlockStatus(_0x237c49, "block").then(_0x3646b4 => {
		_0x51ddfa.react("✨", _0x51ddfa);
	  }).catch(_0x347137 => _0x51ddfa.reply("*_Can't block user, Sorry!!_*"));
	} catch (_0x37166b) {
	  await _0x51ddfa.error(_0x37166b + "\n\ncommand: block", _0x37166b, false);
	}
  });
  smd({
	cmdname: "unblock",
	info: "Unblocked user.",
	type: "whatsapp",
	fromMe: true,
	filename: __filename
  }, async _0x372598 => {
	try {
	  let _0x4f0daf = _0x372598.reply_message ? _0x372598.reply_message.sender : !_0x372598.isGroup ? _0x372598.from : _0x372598.mentionedJid[0] ? _0x372598.mentionedJid[0] : "";
	  if (!_0x4f0daf && !_0x4f0daf.includes("@s.whatsapp.net")) {
		return await _0x372598.reply("*Uhh dear, reply/mention an User*");
	  }
	  await _0x372598.bot.updateBlockStatus(_0x4f0daf, "unblock").then(_0xc1e4ca => _0x372598.send("*@" + _0x4f0daf.split("@")[0] + " Unblocked Successfully..!*", {
		mentions: [users]
	  })).catch(_0x1b7358 => _0x372598.reply("*_Can't Unblock user, Make sure user blocked!!_*"));
	} catch (_0x181f50) {
	  await _0x372598.error(_0x181f50 + "\n\ncommand: unblock", _0x181f50);
	}
  });
  cmd({
	pattern: "vv",
	alias: ["viewonce", "retrive"],
	desc: "download viewOnce Message.",
	category: "whatsapp",
	use: "<query>",
	filename: __filename
  }, async (_0x9034b9, _0x25fb23) => {
	try {
	  var _0x1fd65b = _0x9034b9.reply_message && _0x9034b9.reply_message.viewOnce ? _0x9034b9.reply_message : false;
	  if (!_0x1fd65b) {
		return _0x9034b9.reply("```Please Reply A ViewOnce Message```");
	  }
	  let _0x1bc847 = {
		key: _0x1fd65b.key,
		message: {
		  conversation: "```[VIEWONCE FOUND DOWNLOAD 100%]```"
		}
	  };
	  let _0x201e84 = await _0x9034b9.bot.downloadAndSaveMediaMessage(_0x1fd65b.msg);
	  await _0x9034b9.bot.sendMessage(_0x9034b9.jid, {
		[_0x1fd65b.mtype2.split("Mes")[0]]: {
		  url: _0x201e84
		},
		caption: _0x1fd65b.body
	  }, {
		quoted: _0x1bc847
	  });
	} catch (_0x1a1295) {
	  await message.error(_0x1a1295 + "\n\ncommand: vv", _0x1a1295);
	}
  });