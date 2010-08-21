/*jslint browser: true */
/*global JSJaCConsoleLogger, JSJaCCookie, aJSJaCPacket, JSJaCPresence, 
  JSJaCMessage, JSJaCJID, JSJaCHttpBindingConnection, 
  bro_username, bro_timestamp, bro_hash, oDbg: true, window */
(function($) {

XmppClient = {
  user_jid: null,
  chat_jid: null,
  join_chat_message: 'Say Hi to Trevor. Enter your text here.',
colors:['#3366FF','#CC33FF','#FF3366','#FFCC33','#66FF33','#33FFCC','#003DF5','#002EB8','#F5B800','#B88A00','#6633FF','#FF33CC','#FF6633','#CCFF33','#33FF66','#33CCFF'],
  user_hash: {},
  init: function(username, password) {
    // for debugging only.
    if (window.location.toString().match(/debug/)) { oDbg = new JSJaCConsoleLogger(2); }

    //$('input.message').data('message',this.message).focus(function() {

    //  if($(this).val() == $(this).data('message') ){
    //    $(this).val('');
    //  }
    //});

    //$('input.message').val(this.message);

		XmppClient.login(username, password);
		XmppClient.chat_jid = new JSJaCJID(window.xmppclient_chatroom);
  },

	append_widget: function(target) {
		$(target).append('<div id="xmppclient-widget">' + 
			'<div id="xmppclient-err"></div>' + 
			'<div id="chat"></div>' + 
			'<div id="sendmsg_pane">' + 
				'<form name="send_chat_form" id="send_chat_form">' + 
					'<input type="hidden" name="sendTo" tabindex="1" value="tgrayson@trevorgrayson.com/home"/>' + 
					'<textarea name="msg" id="msgArea" class="message" rows="3" tabindex="2">' + XmppClient.join_chat_message + '</textarea>' + 
					'<!--<input type="submit"/>-->' + 
				'</form>' + 
			'</div>' + 
		'</div>');

	},
	
	bind_send_form: function(form_id) {
		$('#msgArea').keyup(function(e){
			if( e.keyCode === 13 && $('#msgArea').val() != XmppClient.join_chat_message ) {
				$('#send_chat_form').submit();
			}
		});

		$('#msgArea').focus(function(e){
			if(this.value == XmppClient.join_chat_message) {
				$(this).val('');
			}
		});

    $('#'+ form_id).submit(function() {
      var message = $(this).find('.message').val();

      if (message != '') { //don't send blank mesages!
        XmppClient.sendMsg(message);
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

  addMessage: function(message, name) {
    var even = ($('#chat .msg').size() % 2) === 0;
		var color = XmppClient.getColor(name);

		var new_element = $('<div class="msg' + (even?' even':'') + '"><strong style="color: ' + color + '">' + name + '</strong><p>' + message + '</p></div>');
    $('#chat')
      .append(new_element)
      //.queue(function() {
      //  $(this).scrollTo('max').dequeue();
      //});
		
		//Should just return element so they may run whatever things on it
		//new_element.delay(9000).fadeOut('slow');
		//return new_element;
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

		if(aJSJaCPacket.getBody().match(/goto:.*/)){
			XmppClient.addMessage(nickname + ' just moved to <a target="theshow" href="' + 
				aJSJaCPacket.getBody().substring(5) + '">' + aJSJaCPacket.getBody().substring(5) + '</a>');
		//WRONG!
		} else if(aJSJaCPacket.getBody().match(/http.*/)){
			XmppClient.addMessage(aJSJaCPacket.getBody().htmlEnc(), XmppClient.displayName(nickname));
			$('#theshow').attr('src',aJSJaCPacket.getBody());
		} else {
			XmppClient.addMessage(aJSJaCPacket.getBody().htmlEnc(), XmppClient.displayName(nickname));
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
      if( this.username /*&& !XmppClient.isAnonymous(XmppClient.getNick())*/) {
        $('#send_chat_form').show();
        XmppClient.infoMessage('Welcome ' + XmppClient.getNick());
      }
      this.send(new JSJaCPresence());
    } else {
      XmppClient.errorMessage('could not register w/ chat');
    }
  },

  handleResume: function() {
    if(this.username) {
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

  getNick: function() {
    return XmppClient.user_jid.toString().split('/')[1];
  },
	
  chatroom: function() {
    return XmppClient.chat_jid.toString();
  },

  sendMsg: function(message) {
    try {
      var aMsg = new JSJaCMessage();
      aMsg.setTo(XmppClient.chat_jid);
      aMsg.setBody(message);

			if( XmppClient.chat_jid.toString().match(/@conference/) ) {
				aMsg.setType('groupchat');
			} else {
				XmppClient.addMessage( message, XmppClient.getNick() );
			}

      XmppClient.con.send(aMsg);

    } catch (e) {
      $('#chat').html("<div class='msg error''>Error: "+ e.message +"</div>");
    }
  },

  login: function(jid_str, hash){
		try {
			if( JSJaCCookie.get('xmppclient_jid') ) {
				jid_str = JSJaCCookie.get('xmppclient_jid');
				hash = JSJaCCookie.get('xmppclient_password');
			} 
		} catch(e) { } 

		if(jid_str != undefined) {
			JSJaCCookie('xmppclient_jid',jid_str).write();
			JSJaCCookie('xmppclient_password',hash).write();
		}
    
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
      
			XmppClient.append_widget('body');
			XmppClient.bind_send_form('send_chat_form');

    } catch (e) {
      $('#xmppclient-err').html(e.toString());
    }
  },
  
  destroy: function() {
    var con = XmppClient.con;
    if (typeof nick != 'undefined' && XmppClient.isAnonymous(XmppClient.getNick())) {
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
