# NOT YET WORKING
include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI support for iperf3
LUCI_DEPENDS:=+iperf3
LUCI_PKGARCH:=all
PKG_VERSION:=1.0.0
PKG_RELEASE:=1

include ../../luci.mk

# call BuildPackage - OpenWrt buildroot signature
$(eval $(call BuildPackage,luci-app-iperf3))
