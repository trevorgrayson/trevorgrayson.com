/*jslint browser: true */
/*global JSJaCConsoleLogger, JSJaCCookie, aJSJaCPacket, JSJaCPresence, 
  JSJaCMessage, JSJaCJID, JSJaCHttpBindingConnection, SONYMUSIC_COPPA_13,
  bro_username, bro_timestamp, bro_hash, oDbg: true, window */
(function($) {

XmppClient = {
  user_jid: null,
  chat_jid: null,
  message: 'Talk Back. Enter your text here.',
  colors: ['#3366FF', '#CC33FF', '#FF3366', '#FFCC33', '#66FF33', '#33FFCC', '#003DF5', '#002EB8', '#F5B800', '#B88A00', '#6633FF', '#FF33CC', '#FF6633', '#CCFF33', '#33FF66', '#33CCFF'],
  user_hash: {},
  init: function() {
    // for debugging only.
    if (window.location.querystring['debug'] == 'true') {
      oDbg = new JSJaCConsoleLogger(2);
    }

		XmppClient.append_widget('body');
		XmppClient.bind_send_form('send_chat_form');
    
    $('input.message').data('message',this.message).focus(function() {

      if($(this).val() == $(this).data('message') ){
        $(this).val('');
      }
    });

    $('input.message').val(this.message);

    if (bro_jid && bro_hash) {
      XmppClient.login(bro_jid, bro_hash);
    }
    
    XmppClient.chat_jid = new JSJaCJID(window.bro_chatroom);
  },

	append_widget: function(target) {
		$(target).append('<div id="xmppclient-widget">' + 
			'<div id="err"></div>' + 
			'<div id="chat"></div>' + 
			'<div id="sendmsg_pane">' + 
				'<form name="send_chat_form" id="send_chat_form">' + 
					'<input type="hidden" name="sendTo" tabindex="1" value="tgrayson@trevorgrayson.com/home"/>' + 
					'<textarea name="msg" id="msgArea" class="message" rows="3" tabindex="2"></textarea>' + 
					'<!--<input type="submit"/>-->' + 
				'</form>' + 
			'</div>' + 
		'</div>');

		$('#msgArea').keyup(function(e){
			if( e.keyCode === 13 && $('#msgArea').val() != join_chat_message ) {
				$('#send_chat_form').submit();
			}
		});

	},
	
	bind_send_form: function(form_id) {
    $('#'+ form_id).submit(function() {
      var message = $(this).find('.message').val();

      if (message != '') { //don't send blank mesages!
        XmppClient.sendMsg(message, {'drupal_user': {'icon': XmppClient.getIcon()} });
        $(this).find('.message').val('');
      }
      return false;
    });
    
	},

	getColor: function(username) {
    var user_hash = XmppClient.user_hash;
    var color='#000';
    if(user_hash[username] && user_hash[username].color) {
      color = user_hash[username].color;
    } else {
      var colors = XmppClient.colors;
      color = colors.shift();
      colors.push(color);
      user_hash[username] = {'color': color};
      
      this.colors = colors;
    }

		return color;
	},

  addMessage: function(message, name, username, icon) {
    var even = ($('#chat .msg').size() % 2) === 0;
		var color = XmppClient.getColor(name);

		var new_element = $('<div class="msg' + (even?' even':'') + '"><strong style="color: ' + color + '">' + name + '</strong><p>' + message + '</p></div>');
    $('#chat')
      .append(new_element)
      //.queue(function() {
      //  $(this).scrollTo('max').dequeue();
      //});
		
		new_element.delay(9000).fadeOut('slow');
  },
  
  infoMessage: function(message) {
    var $e = $('<div class="msg info-msg"><p>' + message + '</p></div>');
    $e.appendTo('#chat');
    $e[0].scrollIntoView();
		$e.delay(1000).fadeOut('slow');
  },
  
  errorMessage: function(message) {
    $('#chat')
      .append('<div class="msg error-msg"><p>' + message + '</p></div>')
      .queue(function() {
        $(this).scrollTo('max').dequeue();
      });
  },

  displayName: function(name) {
    if (name) {
      return name.replace(/\+/g,' ');
    }
    else {
      return 'anonymous';
    }
  },

  handlePresence: function(aJSJaCPacket) {
    if (aJSJaCPacket.getFromJID().toString() == aJSJaCPacket.getToJID().toString()) {
      return;
    }

    var username = aJSJaCPacket.getFromJID().toString().split('@')[0];
    var name = aJSJaCPacket.getFromJID().toString().split('/')[1];
    var msg;
    if (!aJSJaCPacket.getType() && !aJSJaCPacket.getShow() && !XmppClient.isAnonymous(name))  {
      msg = name + ' joined the chat room.';
    }

		var color = XmppClient.getColor(name);

    if (msg) {
      msg = '<span style="color: ' + color + '">' + msg + '</span>';
      XmppClient.infoMessage(msg);
    }
  },
  
  handleMessage: function(aJSJaCPacket) {
    var username = aJSJaCPacket.getFromJID().toString().split('@')[0];
    var nickname = aJSJaCPacket.getFromJID().toString().split('/')[1];
    var icon = '';
    try {
      icon = aJSJaCPacket.getChild('drupal_user','*').getAttribute('icon');
    } 
    catch(e) {}
		if(aJSJaCPacket.getBody().match(/goto:.*/)){
			XmppClient.addMessage(nickname + ' just moved to <a target="theshow" href="' + 
				aJSJaCPacket.getBody().substring(5) + '">' + aJSJaCPacket.getBody().substring(5) + '</a>');
		//WRONG!
		} else if(aJSJaCPacket.getBody().match(/http.*/)){
			XmppClient.addMessage(aJSJaCPacket.getBody().htmlEnc(), XmppClient.displayName(nickname), XmppClient.displayName(username), icon);
			$('#theshow').attr('src',aJSJaCPacket.getBody());
		} else {
			XmppClient.addMessage(aJSJaCPacket.getBody().htmlEnc(), XmppClient.displayName(nickname), XmppClient.displayName(username), icon);
		}
  },
  
  handleError: function(e) {
    var message = '';
    switch( e.getAttribute('code') ) {
      case '503':
        message= 'You have been logged out! Refresh to log back in.';
        break;
      default:
        message = "An error occured:<br />"+ ("Code: "+ e.getAttribute('code')+"\nType: " + e.getAttribute('type')+ "\nCondition: "+ e.firstChild.nodeName).htmlEnc();
    }
    
    $('#chat').append('<div class="msg error-msg"><p>' + message + '</p></div>');
    $('#chat').scrollTo('100%');

    if (XmppClient.con.connected()) {
      XmppClient.con.disconnect();
    }
  },
  
  handleConnected: function() {
    if ( XmppClient.joinChatroom() ) {
      if( this.username && !XmppClient.isAnonymous(XmppClient.getNick())) {
        $('#send_chat_form').show();
        XmppClient.infoMessage('Welcome to the chatroom ' + XmppClient.getNick());
      }
      this.send(new JSJaCPresence());
    } else {
      XmppClient.errorMessage('could not register w/ chat');
    }
  },

  handleResume: function() {
    if(this.username && !XmppClient.isAnonymous(XmppClient.getNick())) {
      $('#send_chat_form').show();
      XmppClient.infoMessage('Your are logged in as ' + XmppClient.getNick());
      this.send(new JSJaCPresence());
    }
  },

  // Enter the room.
  // http://xmpp.org/extensions/xep-0045.html#enter
  joinChatroom: function() {
    var jid = XmppClient.chat_jid.clone();
    jid.setResource(XmppClient.getNick());

    var packet = new JSJaCPresence();
    packet.setTo(jid.toString());
    packet.appendNode('x', {xmlns: "http://jabber.org/protocol/muc"});

    return XmppClient.con.send(packet);
  },

  setupCon: function(con) {
    con.registerHandler('message', XmppClient.handleMessage);
    con.registerHandler('onconnect', XmppClient.handleConnected);
    con.registerHandler('onresume', XmppClient.handleResume);
    con.registerHandler('onerror', XmppClient.handleError);
    con.registerHandler('presence', XmppClient.handlePresence);
  },
  
  isAnonymous: function(nick) {
    var anon = (nick.match(/^anonymous-/));
    return anon;
  },

  getIcon: function() {
    try {
      return JSJaCCookie.get('bro_icon');
    }
    catch (e) {
      return 'http://null/images/nophoto.gif';
    }
  },

  getNick: function() {
    //return XmppClient.user_jid.getResource();
    return window.bro_nick;
  },
	
  chatroom: function() {
    return XmppClient.chat_jid.toString();
  },

  sendMsg: function(message/*,extra*/) {
    var icon = XmppClient.getIcon();
    var extra = {'drupal_user': {'icon': icon} };
    
    try {
      var aMsg = new JSJaCMessage();
      aMsg.setTo(XmppClient.chat_jid);
      aMsg.setType('groupchat');
      aMsg.setBody(message);

      $.each(extra, function(obj, attribs) {
        icon = aMsg.appendNode(obj,attribs);
      });

      XmppClient.con.send(aMsg);

    } catch (e) {
      $('#chat').html("<div class='msg error''>Error: "+ e.message +"</div>");
    }
  },

  login: function(jid_str, hash){
    var jid = new JSJaCJID(jid_str);
    XmppClient.user_jid = jid;
    
    try {
      // setup args for contructor
      var oArgs = {};
      oArgs.httpbase = '/http-bind/';

      if (typeof(oDbg) != 'undefined') {
        oArgs.oDbg = oDbg;
      }
      var con = new JSJaCHttpBindingConnection(oArgs);

      XmppClient.setupCon(con);
      XmppClient.con = con;

      if(!con.resume()){
        // setup args for connect method
        oArgs = {};
        oArgs.domain = jid.getDomain();
        oArgs.username = jid.getNode();
        oArgs.resource = jid.getResource();
        oArgs.pass = hash;
        oArgs.register = false;
        con.connect(oArgs);
      }
      

    } catch (e) {
      $('#bro_error').html(e.toString());
    }
  },
  
  destroy: function() {
    var con = XmppClient.con;
    if (XmppClient.isAnonymous(XmppClient.getNick())) {
      con.disconnect();
    }
    else if (typeof con != 'undefined' && con && con.connected()) {
      if (con.suspend) {
       con.suspend(); 
      }
    }
  }

}; /* end of XmppClient class */

$(window).load(function() {
  XmppClient.init();
});

$(window).unload(function() {
  XmppClient.destroy();
});

window.onerror = function(e) {
  XmppClient.errorMessage(e.message);

  if (XmppClient.con && XmppClient.con.connected()) {
    XmppClient.con.disconnect();
  }
  return false;
};

})(jQuery);

