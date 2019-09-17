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
  </head>
  <body>
    <h1><xsl:value-of select="//vc:FN"/></h1>
    <ul class="menu">
      <xsl:apply-templates/>
    </ul>
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
      <li>trevorgrayson@<a href="http://stackoverflow.com/users/965161/trevorgrayson"><strong>stackoverflow</strong></a></li>
      <li>trevorgrayson@<a href="mailto:{vc:EMAIL}"><strong>trevorgrayson.com</strong></a></li>

      <!--<li><a href="javascript:var name= prompt('What is your name?');XmppClient.init(name + '@trevorgrayson.com/' + name, 'password')">Talk Now</a></li>-->
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
