

    suite('basic features', function() {
      var scrollingRegion, xScroll;

      setup(function() {
        scrollingRegion = fixture('trivialScrollable');
        xScroll = Polymer.dom(scrollingRegion).querySelector('x-scrollable');
      });

      test('default', function() {
        assert.equal(xScroll._scrollTop, 0, '_scrollTop');
        assert.equal(xScroll._scrollLeft, 0, '_scrollLeft');
        assert.equal(xScroll._scrollTargetWidth, 0, '_scrollTargetWidth');
        assert.equal(xScroll._scrollTargetHeight, 0, '_scrollTargetHeight');
        assert.equal(xScroll.scrollTarget, null, 'scrollTarget');
        assert.equal(xScroll._defaultScrollTarget, xScroll.scrollTarget, '_defaultScrollTarget');
      });

      test('invalid `scrollTarget` selector', function(done) {
        flush(function() {
          xScroll.scrollTarget = 'invalid-id';
          assert.equal(xScroll.scrollTarget, null);
          done();
        });
      });

      test('valid `scrollTarget` selector', function(done) {
        flush(function() {
          xScroll.scrollTarget = 'temporaryScrollingRegion';
          assert.equal(xScroll.scrollTarget, scrollingRegion);
          done();
        });
      });

      test('toggleScrollListener', function(done) {
        flush(function() {
          xScroll._scrollHandler = sinon.spy();
          xScroll.scrollTarget = 'temporaryScrollingRegion';
          xScroll.scroll(0, 100);
          xScroll.toggleScrollListener(true);
          setTimeout(function() {
            assert.isTrue(xScroll._scrollHandler.called, '_scrollHandler should be called');
            xScroll._scrollHandler.reset();
            xScroll.toggleScrollListener(false);
            xScroll.scroll(0, 200);
            setTimeout(function() {
              assert.isFalse(xScroll._scrollHandler.called, '_scrollHandler should not be called');
              done();
            }, 100);
          }, 100);
        });
      });
    });

    suite('scrolling region', function() {
      var scrollingRegion, xScrollable;

      setup(function() {
        scrollingRegion = fixture('trivialScrollingRegion');
        xScrollable = Polymer.dom(scrollingRegion).querySelector('x-scrollable');
      });

      teardown(function() {
        xScrollable._scrollTop = 0;
        xScrollable._scrollLeft = 0;
      });

      test('scrollTarget reference', function(done) {
        flush(function() {
          assert.equal(xScrollable.scrollTarget, scrollingRegion);
          done();
        });
      });

      test('invalid scrollTarget', function(done) {
        flush(function() {
          assert.equal(xScrollable.scrollTarget, scrollingRegion);
          done();
        });
      });

      test('setters', function(done) {
        flush(function() {
          xScrollable._scrollTop = 100;
          xScrollable._scrollLeft = 100;

          assert.equal(scrollingRegion.scrollTop, 100);
          assert.equal(scrollingRegion.scrollLeft, 100);

          done();
        });
      });

      test('getters', function(done) {
        flush(function() {
          scrollingRegion.scrollTop = 50;
          scrollingRegion.scrollLeft = 50;

          assert.equal(xScrollable._scrollTop, 50, '_scrollTop');
          assert.equal(xScrollable._scrollLeft, 50, '_scrollLeft');
          assert.equal(xScrollable._scrollTargetWidth, scrollingRegion.offsetWidth, '_scrollTargetWidth');
          assert.equal(xScrollable._scrollTargetHeight, scrollingRegion.offsetHeight, '_scrollTargetHeight');

          done();
        });
      });

      test('scroll method', function(done) {
        flush(function() {
          xScrollable.scroll(110, 110);

          assert.equal(xScrollable._scrollTop, 110);
          assert.equal(xScrollable._scrollLeft, 110);

          xScrollable.scroll(0, 0);

          assert.equal(xScrollable._scrollTop, 0);
          assert.equal(xScrollable._scrollLeft, 0);

          done();
        });
      });
    });

    suite('document scroll', function() {
      var xScrollable;

      setup(function() {
        xScrollable = fixture('trivialDocumentScroll');
      });

      teardown(function() {
        xScrollable._scrollTop = 0;
        xScrollable._scrollLeft = 0;
      });

      test('scrollTarget reference', function(done) {
        flush(function() {
          assert.equal(xScrollable.scrollTarget, document.documentElement);
          done();
        });
      });

      test('setters', function(done) {
        flush(function() {
          xScrollable._scrollTop = 100;
          xScrollable._scrollLeft = 100;

          assert.equal(window.pageXOffset, 100);
          assert.equal(window.pageYOffset, 100);

          done();
        });
      });

      test('getters', function(done) {
        flush(function() {
          window.scrollTo(50, 50);

          assert.equal(xScrollable._scrollTop, 50, '_scrollTop');
          assert.equal(xScrollable._scrollLeft, 50, '_scrollLeft');
          assert.equal(xScrollable._scrollTargetWidth, window.innerWidth, '_scrollTargetWidth');
          assert.equal(xScrollable._scrollTargetHeight, window.innerHeight, '_scrollTargetHeight');

          done();
        });
      });

      test('scroll method', function(done) {
        flush(function() {

          xScrollable.scroll(1, 2);

          assert.equal(xScrollable._scrollLeft, 1);
          assert.equal(xScrollable._scrollTop, 2);

          xScrollable.scroll(3, 4);

          assert.equal(xScrollable._scrollLeft, 3);
          assert.equal(xScrollable._scrollTop, 4);

          done();
        });
      });
    });

    suite('nested scrolling region', function() {
      var xScrollingRegion;
      var xScrollable;

      setup(function() {
        var nestedScrollingRegion = fixture('trivialNestedScrollingRegion');
        xScrollable = nestedScrollingRegion.$.xScrollable;
        xScrollingRegion = nestedScrollingRegion.$.xRegion;
      });

      teardown(function() {
        xScrollable._scrollTop = 0;
        xScrollable._scrollLeft = 0;
      });

      test('scrollTarget reference', function(done) {
        flush(function() {
          assert.equal(xScrollable.scrollTarget, xScrollingRegion);
          done();
        });
      });

      test('setters', function(done) {
        flush(function() {
          xScrollable._scrollTop = 10;
          xScrollable._scrollLeft = 20;

          assert.equal(xScrollingRegion.scrollTop, 10);
          assert.equal(xScrollingRegion.scrollLeft, 20);

          done();
        });
      });

      test('getters', function(done) {
        flush(function() {
          xScrollable._scrollTop = 10;
          xScrollable._scrollLeft = 20;

          assert.equal(xScrollable._scrollTop, 10, '_scrollTop');
          assert.equal(xScrollable._scrollLeft, 20, '_scrollLeft');

          done();
        });
      });

      test('scroll method', function(done) {
        flush(function() {

          xScrollable.scroll(1, 2);

          assert.equal(xScrollable._scrollLeft, 1);
          assert.equal(xScrollable._scrollTop, 2);

          xScrollable.scroll(3, 4);

          assert.equal(xScrollable._scrollLeft, 3);
          assert.equal(xScrollable._scrollTop, 4);

          done();
        });
      });
    });

  