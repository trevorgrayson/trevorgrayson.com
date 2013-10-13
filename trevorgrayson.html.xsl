<?xml version="1.0"?>
<xsl:stylesheet 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:thg="http://trevorgrayson.com"
  xmlns:vc="http://xmpp.org/extensions/xep-0054.html"
  version="1.0">
<xsl:output indent="yes" method="html" 
  doctype-system="http://www.w3.org/TR/html4/strict.dtd"
  doctype-public="-//W3C//DTD HTML 4.01//EN"
/>
<xsl:template match="/">
<html>
  <head>
    <title>Trevor Grayson</title>
    <link href='http://fonts.googleapis.com/css?family=Old+Standard+TT' rel='stylesheet' type='text/css'/>
    <link type="text/css" rel="stylesheet" href="css/reset.css"/>
    <link type="text/css" rel="stylesheet" href="css/trevorgrayson.css"/>
    <script type="text/javascript" src="javascripts/jquery.min.js"></script>
    <script type="text/javascript" src="javascripts/jsjac.js"></script>
    <script type="text/javascript" src="javascripts/xmpp-client.js"></script>
    <script type="text/javascript" src="http://widgets.twimg.com/j/2/widget.js"></script>
    <script type="text/javascript">
    var join_chat_message = "Talk back. Enter Message here."

    rand = Math.floor(Math.random() * 100000000000).toString(); 
    //xmppclient_nick= prompt("Hello! What's your name?",'anon' + rand);
    //xmppclient_jid='anon' + rand + '@trevorgrayson.com/' + xmppclient_nick;
    //xmppclient_password='password';
    xmppclient_chatroom='tgrayson@trevorgrayson.com';

    $(document).ready(function(){
      $('#msgArea').val(join_chat_message);

      $('#send_chat_form').submit(function() {
        var message = $(this).find('.message').val();

        if (message != '') { //don't send blank mesages!
          $(this).find('.message').val('');
        }
        return false;
      });

      $('#navigation_form').submit(function(e) {
        var message = $('#navigation_url').val();
        XmppClient.sendMsg(message);

        return false;
      });

    });
    function insert_twitter(){
      /*
      new TWTR.Widget({
        version: 2,
        type: 'profile',
        rpp: 1,
        interval: 6000,
        width: 197,
        height: 300,
        theme: {
          shell: {
            background: 'transparent',
            color: '#000000'
          },
          tweets: {
            background: 'transparent',
            color: '#000000',
            links: '#ab8526'
          }
        },
        features: {
          scrollbar: false,
          loop: false,
          live: false,
          hashtags: true,
          timestamp: true,
          avatars: false,
          behavior: 'all'
        }
      }).render().setUser('TrevorGrayson').start();
      */
    }
  </script>
  </head>
  <body>
    <!--
    <xsl:attribute name="style">
      <xsl:text disable-output-escaping="yes"><![CDATA[background:url(]]></xsl:text>
      <xsl:text disable-output-escaping="yes"><![CDATA[http://maps.google.com/maps/api/staticmap?center=]]></xsl:text>
      <xsl:value-of select="substring-after(//Placemark[1]/Point/coordinates,',')"/>
      <xsl:text>,</xsl:text>
      <xsl:value-of select="substring-before(//Placemark[1]/Point/coordinates,',')"/>
      <xsl:text disable-output-escaping="yes"><![CDATA[&zoom=15&size=640x640&maptype=terrain&sensor=false]]></xsl:text>
      <xsl:text disable-output-escaping="yes"><![CDATA[)]]></xsl:text>
    </xsl:attribute>
    -->
    <h1><xsl:value-of select="//vc:FN"/></h1>
    <ul class="menu">
      <xsl:apply-templates/>
    </ul>
    <script>insert_twitter();</script>
    <p class="location">
      <span class="last-seen">
        <xsl:text>Last Seen: @</xsl:text>
        <a>
          <xsl:attribute name="href">http://foursquare.com<xsl:value-of select="//Placemark[1]/description/a[1]/@href"/></xsl:attribute>
          <xsl:value-of select="//Placemark[1]/name"/>
        </a>
      </span> 

      <span class="time"><xsl:value-of select="substring-before(//Placemark[1]/updated, '+')"/></span>
    </p>
    <p class="location">
      <a>
        <xsl:attribute name="href">
          <xsl:text disable-output-escaping="yes"><![CDATA[http://maps.google.com/?z=17&q=]]></xsl:text>
          <xsl:value-of select="substring-after(//Placemark[1]/Point/coordinates,',')"/>
          <xsl:text>,</xsl:text>
          <xsl:value-of select="substring-before(//Placemark[1]/Point/coordinates,',')"/>
        </xsl:attribute>
        <xsl:attribute name="target">_blank</xsl:attribute>
  
        <xsl:text>Find Trevor</xsl:text>
      </a>
    </p>
  </body>
  <xsl:value-of select="//item[1]"/>

</html>
</xsl:template>

<xsl:template match="Placemark">
  <p>Last Seen at: <xsl:value-of select="name"/>
  <span class="time"><xsl:value-of select="substring-before(updated,'+')"/></span></p>
</xsl:template>

<xsl:template match="vc:*">
  <xsl:apply-templates select="thg:*"/>
  <li>
    <a>
      <xsl:attribute name="href">#Contact</xsl:attribute>
      <xsl:text>contact</xsl:text>
    </a>
    <ul>
      <xsl:apply-templates select="vc:ADR"/>
      <li>trevorgrayson@<a href="http://facebook.com/trevorgrayson"><strong>facebook</strong></a></li>
      <li>trevorgrayson@<a href="http://www.linkedin.com/in/trevorgrayson"><strong>linkedin</strong></a></li>
      <li>trevorgrayson@<a href="http://github.com/trevorgrayson"><strong>github</strong></a></li>
      <li>trevorgrayson@<a href="http://stackoverflow.com/trevorgrayson"><strong>stackoverflow</strong></a></li>
      <li>trevorgrayson@<a href="mailto:{vc:EMAIL}"><strong>trevorgrayson.com</strong></a></li>

      <li>fb: <a href="http://facebook.com/trevorgrayson">facebook</a></li>
      <li>in: <a href="http://www.linkedin.com/in/trevorgrayson">linkedin</a></li>
      <li>gh: <a href="http://github.com/trevorgrayson">github</a></li>
      <li>e:  <a href="mailto:{vc:EMAIL}"><xsl:value-of select="vc:EMAIL"/></a></li>
      <li><a href="javascript:var name= prompt('What is your name?');XmppClient.init(name + '@trevorgrayson.com/' + name, 'password')">Talk Now</a></li>
    </ul>
  </li>
</xsl:template>

<xsl:template match="vc:ADR">
  <li><xsl:value-of select="vc:STREET"/>, <xsl:value-of select="vc:LOCALITY"/>, <xsl:value-of select="vc:REGION"/>.</li>
</xsl:template>

<xsl:template match="thg:*">
  <li>
    <a>
      <xsl:attribute name="href">#<xsl:value-of select="name(.)"/></xsl:attribute>
      <xsl:value-of select="name(.)"/>
    </a>
    <ul>
    <xsl:for-each select="*">
      <li>
      <a>
        <xsl:attribute name="href"><xsl:value-of select="@href"/></xsl:attribute>
        <xsl:value-of select="@name"/>
      </a>
      <p><xsl:value-of select="."/></p>
      </li>
    </xsl:for-each>
    </ul>
  </li>
</xsl:template>

</xsl:stylesheet>
