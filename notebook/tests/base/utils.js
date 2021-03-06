casper.notebook_test(function () {
    // Note, \033 is the octal notation of \u001b
    var input = [
        "\033[0m[\033[0minfo\033[0m] \033[0mtext\033[0m",
        "\033[0m[\033[33mwarn\033[0m] \033[0m\tmore text\033[0m",
        "\033[0m[\033[33mwarn\033[0m] \033[0m  https://some/url/to/a/file.ext\033[0m",
        "\033[0m[\033[31merror\033[0m] \033[0m\033[0m",
        "\033[0m[\033[31merror\033[0m] \033[0m\teven more text\033[0m",
        "\u001b[?25hBuilding wheels for collected packages: scipy",
        "\033[0m[\033[31merror\033[0m] \033[0m\t\tand more more text\033[0m"].join("\n");

    var output = [
        "[info] text",
        "[<span  class=\"ansiyellow\">warn</span>] \tmore text",
        "[<span  class=\"ansiyellow\">warn</span>]   https://some/url/to/a/file.ext",
        "[<span  class=\"ansired\">error</span>] ",
        "[<span  class=\"ansired\">error</span>] \teven more text",
        "Building wheels for collected packages: scipy",
        "[<span  class=\"ansired\">error</span>] \t\tand more more text"].join("\n");

    var result = this.evaluate(function (input) {
        return IPython.utils.fixConsole(input);
    }, input);

    this.test.assertEquals(result, output, "IPython.utils.fixConsole() handles [0m correctly");
    
    this.thenEvaluate(function() {
        define('nbextensions/a', [], function() { window.a = true; });
        define('nbextensions/c', [], function() { window.c = true; });
        require(['base/js/utils'], function(utils) {
            utils.load_extensions('a', 'b', 'c');
        });
    }).then(function() {
        this.waitFor(function() {
            return this.evaluate(function() { return window.a; });
        });
        
        this.waitFor(function() {
            return this.evaluate(function() { return window.a; });
        });
    });
});
