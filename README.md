# luci-app-iperf3
Small footprint Luci app for iperf3.

It allows iperf3 to be launched as server or client through the Luci Openwrt web interface.
It is written in JavaScript and aims to be very small, so it can also fit on devices with little storage.

**Installation:**
In Luci / Openwrt go to System -> Software and upload the .ipk release file. Thats it.

If you want to build the file yourself, follow the instructions found here: https://github.com/openwrt/luci/blob/master/applications/luci-app-example/BUILDING.md

**Remarks**
The app is based on the new Luci JavaScript based interface. It is thus not working on older Luci interfaces based on lua.
