'use strict';
'require view';
'require form';
'require fs';
'require ui';
'require uci';

return view.extend({
    load: function() {
        return fs.exec_direct('/usr/bin/iperf3', ['--version']);
    },

    render: function(version) {
        var m, s, o;

        m = new form.Map('iperf3', _('iPerf3'), _('This is the iPerf3 configuration page.'));

        s = m.section(form.TypedSection, 'iperf3', _('Settings'));
        s.anonymous = true;

        o = s.option(form.Value, 'server', _('Server'), _('The iPerf3 server to connect to.'));
        o.datatype = 'host';
        
        o = s.option(form.Value, 'port', _('Port'), _('The port to use for the iPerf3 connection.'));
        o.datatype = 'port';
        o.placeholder = '5201';

        o = s.option(form.Flag, 'reverse', _('Reverse'), _('Run in reverse mode.'));
        o.default = o.disabled;

        // Add a button to start the iperf3 test
        o = s.option(form.Button, '_start', _('Start Client Mode'));
        o.inputtitle = _('Start iPerf3 Client');
        o.onclick = this.handleStartTest;

        // Add a button to start the iperf3 server
        o = s.option(form.Button, '_start_server', _('Start Server Mode'));
        o.inputtitle = _('Start iPerf3 Server');
        o.onclick = this.handleStartServer;

        // Add a button to stop the iperf3 server
        o = s.option(form.Button, '_stop_server', _('Stop iperf3'));
        o.inputtitle = _('Stop iPerf3 Server');
        o.onclick = this.handleStopServer;

        // Add a placeholder for the results and testing
        //var se = uci.get_first('iperf3', 'iperf3', 'server');
        //o = s.option(form.DummyValue, '_results', _(se));
        //o.textvalue = 'test';
        

        return m.render();
    },

    handleStartTest: function() {
        var server = uci.get_first('iperf3', 'iperf3', 'server');
        var port = uci.get_first('iperf3', 'iperf3', 'port') || '5201';
        var reverse = uci.get_first('iperf3', 'iperf3', 'reverse') ? '-R' : '';
        
        var modalContent = ui.showModal(_('iPerf3 Test Results'), [E('div', { 'class': 'cbi-section' }),
            E('p', _('running... Will take a bit...')),
            E('button', {
                'class': 'btn',
                'click': function() {
                    ui.hideModal();
                }
            }, _('Dismiss'))
            ]);
        
            fs.exec('/usr/bin/iperf3', ['-c', server, '-p', port, reverse]).then(function(res) {
                // Check if res.stdout is defined
                if (res.stdout && res.stdout.length > 0){
                    modalContent.removeChild(modalContent.lastChild);
                    modalContent.removeChild(modalContent.lastChild);
                    modalContent.appendChild(E('pre', [res.stdout]));
                    modalContent.appendChild(E('button', {
                        'class': 'btn',
                        'click': function() {
                            ui.hideModal();
                        }
                    }, _('Dismiss')));
                }
                else {
                    // Handle case where stdout is undefined or empty
                    modalContent.removeChild(modalContent.lastChild);
                    modalContent.removeChild(modalContent.lastChild);
                    modalContent.appendChild(E('p', 'Failed to start iPerf3 test: No output received'));
                    modalContent.appendChild(E('button', {
                        'class': 'btn',
                        'click': function() {
                            ui.hideModal();
                        }
                    }, _('Dismiss')));
                }
            })
            .catch(function(err) {
                // Improved error handling
                ui.addNotification(null, _('Failed to start iPerf3 test: ') + err.message, 'error');
            });
    },


    handleStartServer: function() {
        var port = uci.get_first('iperf3', 'iperf3', 'port') || '5201';
        fs.exec('/usr/bin/iperf3', ['-s', '-D', '-p', port]).then(function(res) {
            ui.addNotification(null, _('iPerf3 server started successfully'), 'info');
        }).catch(function(err) {
            ui.addNotification(null, _('Failed to start iPerf3 server: ') + err.message, 'error');
        });
    },

    handleStopServer: function() {
        var command = `killall iperf3`;

        fs.exec_direct('killall', ['iperf3']).then(function(res) {
            ui.addNotification(null, _('iPerf3 stopped successfully'), 'info');
        }).catch(function(err) {
            ui.addNotification(null, _('Failed to stop iPerf3 server: ') + err.message, 'error');
        });
    }
});

