import Vue from 'vue';
import {mapState} from "vuex";
import {Terminal} from 'xterm';
import * as TerminalFit from 'xterm/lib/addons/fit/fit';
import {Socketio} from "@/mixins/socketio";

type DataStructure = {
    terminal: Terminal | null,
    command: string,
    commandHistory: Array<string>,
    commandHistoryIndex: number,
}

export default Vue.component('server-console', {
    mixins: [Socketio],
    computed: {
        ...mapState('socket', ['connected']),
    },

    watch: {
        /**
         * Watch the connected variable and when it becomes true request the server logs.
         */
        connected: function (state: boolean) {
            if (state) {
                this.$nextTick(() => {
                    this.mountTerminal();
                });
            } else {
                this.terminal && this.terminal.clear();
            }
        },
    },

    /**
     * Listen for specific socket.io emits from the server.
     */
    sockets: {
        'server log': function (data: string) {
            data.split(/\n/g).forEach((line: string): void => {
                if (this.terminal) {
                    this.terminal.writeln(line + '\u001b[0m');
                }
            });
        },

        'console': function (data: { line: string }) {
            data.line.split(/\n/g).forEach((line: string): void => {
                if (this.terminal) {
                    this.terminal.writeln(line + '\u001b[0m');
                }
            });
        },
    },

    /**
     * Mount the component and setup all of the terminal actions. Also fetches the initial
     * logs from the server to populate into the terminal if the socket is connected. If the
     * socket is not connected this will occur automatically when it connects.
     */
    mounted: function () {
        if (this.connected) {
            this.mountTerminal();
        }
    },

    data: function (): DataStructure {
        return {
            terminal: null,
            command: '',
            commandHistory: [],
            commandHistoryIndex: -1,
        };
    },

    methods: {
        /**
         * Mount the terminal and grab the most recent server logs.
         */
        mountTerminal: function () {
            // Get a new instance of the terminal setup.
            this.terminal = this._terminalInstance();

            this.terminal.open((this.$refs.terminal as HTMLElement));
            // @ts-ignore
            this.terminal.fit();
            this.terminal.clear();

            this.$socket().instance().emit('send server log');
        },

        /**
         * Send a command to the server using the configured websocket.
         */
        sendCommand: function () {
            this.commandHistoryIndex = -1;
            this.commandHistory.unshift(this.command);
            this.$socket().instance().emit('send command', this.command);
            this.command = '';
        },

        /**
         * Handle a user pressing up/down arrows when in the command field to scroll through thier
         * command history for this server.
         */
        handleArrowKey: function (e: KeyboardEvent) {
            if (['ArrowUp', 'ArrowDown'].indexOf(e.key) < 0 || e.key === 'ArrowDown' && this.commandHistoryIndex < 0) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (e.key === 'ArrowUp' && (this.commandHistoryIndex + 1 > (this.commandHistory.length - 1))) {
                return;
            }

            this.commandHistoryIndex += (e.key === 'ArrowUp') ? 1 : -1;
            this.command = this.commandHistoryIndex < 0 ? '' : this.commandHistory[this.commandHistoryIndex];
        },

        /**
         * Returns a new instance of the terminal to be used.
         *
         * @private
         */
        _terminalInstance() {
            Terminal.applyAddon(TerminalFit);

            return new Terminal({
                disableStdin: true,
                cursorStyle: 'underline',
                allowTransparency: true,
                fontSize: 12,
                fontFamily: 'Menlo, Monaco, Consolas, monospace',
                rows: 30,
                theme: {
                    background: 'transparent',
                    cursor: 'transparent',
                    black: '#000000',
                    red: '#E54B4B',
                    green: '#9ECE58',
                    yellow: '#FAED70',
                    blue: '#396FE2',
                    magenta: '#BB80B3',
                    cyan: '#2DDAFD',
                    white: '#d0d0d0',
                    brightBlack: 'rgba(255, 255, 255, 0.2)',
                    brightRed: '#FF5370',
                    brightGreen: '#C3E88D',
                    brightYellow: '#FFCB6B',
                    brightBlue: '#82AAFF',
                    brightMagenta: '#C792EA',
                    brightCyan: '#89DDFF',
                    brightWhite: '#ffffff',
                },
            });
        }
    },

    template: `
        <div class="content-box animate fadein">
            <div class="text-xs font-mono">
                <div class="rounded-t p-2 bg-black overflow-scroll w-full" style="min-height: 16rem;max-height:64rem;">
                    <div class="mb-2 text-grey-light" ref="terminal" v-if="connected"></div>
                    <div v-else>
                        <div class="spinner spinner-xl mt-24"></div>
                    </div>
                </div>
                <div class="rounded-b bg-grey-darkest text-white flex">
                    <div class="flex-no-shrink p-2">
                        <span class="font-bold">$</span>
                    </div>
                    <div class="w-full">
                        <input type="text" aria-label="Send console command" class="bg-transparent text-white p-2 pl-0 w-full" placeholder="enter command and press enter to send"
                               ref="command"
                               v-model="command"
                               v-on:keyup.enter="sendCommand"
                               v-on:keydown="handleArrowKey"
                        >
                    </div>
                </div>
            </div>
        </div>
    `,
});