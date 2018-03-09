const assert = require('assert');
const path = require('path');
const {exec} = require('child_process');
const luis = path.resolve('../bin/luis');

describe('The LUIS cli tool', () => {

    it('should print the help contents when --help is used', done => {
        exec(`node ${luis} --help`, (error, stdout, stderr) => {
            assert(stdout.includes('--in') && stdout.includes('--out'));
            done();
        });
    });

    it('should throw and output a message when user or bot is omitted from the input file', done => {
        exec(`echo bot: hello! user:can I get some help? | node ${luis} `, (error, stdout, stderr) => {
            assert(stdout.trim() === 'ReferenceError: Cannot reference "bot" or "user"');
            done();
        });
    });

    it('should accept data as a pipe and output the results', done => {
        exec(`(echo user=Joe && echo bot=LuliBot && echo LuliBot: hello! && echo joe:can I get some help?) | node ${luis} --bot bot --user user`, (error, stdout, stderr) => {
            assert.doesNotThrow(() => JSON.parse(stdout));
            done();
        });
    });

    it('should throw when a malformed config options is encountered in the input', done => {
        exec(`echo bot=LuliBot=joe | node ${luis} `, (error, stdout, stderr) => {
            assert(stdout.trim() === 'Error: Malformed configurations options detected. Options must be in the format optionName=optionValue');
            done();
        });
    });
});