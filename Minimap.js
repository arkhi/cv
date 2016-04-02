/**
 * Generate a minimap of the current document.
 * The script does not take sections into account.
 *
 * @return {object} Minimap Contructor.
 */
(function() {
    'use strict';

    function Header( domObject ) {
        if ( !( this instanceof Header ) ) {
            return new Header();
        }

        this.dom     = domObject;
        this.$target = $( domObject );
    }

    Header.prototype.fetchHeaderData = function fetchHeaderData() {
        var header = this;

        console.log( header );

        header.tag   = header.dom.tagName.toLowerCase();
        header.title = header.$target.html();
        header.top   = header.$target.offset().top;

        return header;
    };

    Header.prototype.percentTop = function percentTop() {
        var header    = this;
        var $document = $( document );

        header.top = header.top * 100 / $document.innerHeight();

        console.log( header.top );

        return header;
    };

    Header.prototype.build = function build( index ) {
        var header = this;

        header.fetchHeaderData();

        header.targetId = header.$target.attr( 'id' ) || 'c-minimap__' + header.tag + '-' + index;

        header.$target.attr( 'id', header.targetId );

        header.$ = $( '<a>', {
            'title': header.title,
            'class': 'c-minimap__link c-minimap__' + header.tag,
            'href':  '#' + header.targetId
        }).css({
            'top': header.percentTop().top + '%'
        });

        return header;
    };

    /**
     * Minimap contructor
     */
    function Minimap() {
        if ( !( this instanceof Minimap ) ) {
            return new Minimap();
        }
    }

    /**
     * Build the minimap.
     */
    Minimap.prototype.build = function build() {
        var minimap = this;

        this.headers  = [];
        this.$headers = $( 'h1, h2, h3, h4, h5, h6' );

        this.$headers.each( function( index, header ) {
            var $item = $( '<li>' ).append( new Header( header ).build( index ).$ );

            minimap.headers.push( $item );
        });

        console.log( minimap.headers );

        this.$ = $( '<ul>', {
            'class': 'c-minimap'
        });

        $( 'body' ).prepend( this.$.append( minimap.headers ) );

        return minimap;
    };


    Minimap.prototype.init = function init() {
        var minimap = this;

        minimap.build();

        return minimap;
    };

    return new Minimap().init();

    // var headers = [{
    //     'title': 'Some title',
    //     'level': 1,
    //     'content': [
    //         {
    //             'title': 'Some title',
    //             'level': 2,
    //             'content': []
    //         },
    //         {
    //             'title': 'Some title',
    //             'level': 2,
    //             'content': []
    //         }
    //     ]
    // },
    // {
    //     'title': 'Some title',
    //     'level': 1,
    //     'content': [
    //         {
    //             'title': 'Some title',
    //             'level': 2,
    //             'content': []
    //         },
    //         {
    //             'title': 'Some title',
    //             'level': 2,
    //             'content': []
    //         }
    //     ]
    // }];
})();
