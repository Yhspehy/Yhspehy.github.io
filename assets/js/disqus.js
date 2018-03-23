var disqus_shortname = 'yhspehy';
var disqus_identifier = 'home';
var disqus_url = 'http://yhspehy.github.io';

(function() {
  var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
  dsq.src = 'https://' + disqus_shortname + '.disqus.com/embed.js';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})();

var reset = function (newIdentifier, newUrl) {
  DISQUS.reset({
    reload: true,
    config: function () {
      this.page.identifier = newIdentifier;
      this.page.url = newUrl;
    }
  });
};

$('#pl__container a').each(function(index) {
  $(this).click(function () {
    console.log(window.location)
    reset(window.location.pathname, window.location.href)
  })
})
