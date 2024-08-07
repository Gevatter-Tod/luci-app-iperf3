include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for iperf3
LUCI_DEPENDS:=+iperf3
LUCI_PKGARCH:=all
PKG_VERSION:=0.1
PKG_RELEASE:=1


PKG_LICENSE:=GPL-2.0

PKG_MAINTAINER:=Gevatter-Tod

include ../../luci.mk

# call BuildPackage - OpenWrt buildroot signature
$(eval $(call BuildPackage,luci-app-iperf3))
