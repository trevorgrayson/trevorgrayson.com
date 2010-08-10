<?xml version="1.0"?>
<xsl:stylesheet 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:thg="http://trevorgrayson.com"
	xmlns:vc="http://xmpp.org/extensions/xep-0054.html"
	version="1.0">
<xsl:template match="/">
<html>
	<head>
		<link href='http://fonts.googleapis.com/css?family=Old+Standard+TT' rel='stylesheet' type='text/css'/>
		<link type="text/css" rel="stylesheet" href="/css/reset.css"/>
		<!--<link type="text/css" rel="stylesheet" href="/chat/chat.css"/>-->
		<link type="text/css" rel="stylesheet" href="/css/trevorgrayson.css"/>
	</head>
	<body>
		<h1><xsl:value-of select="//vc:FN"/></h1>
		<ul class="menu">
			<xsl:apply-templates/>
		</ul>
	</body>
</html>
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
			<li>im: <a href="aim:goim?screenname={vc:AIMID}"><xsl:value-of select="vc:AIMID"/></a></li>
			<li>e: <a href="mailto:{vc:EMAIL}"><xsl:value-of select="vc:EMAIL"/></a></li>
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
