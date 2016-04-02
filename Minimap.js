/**
 * Generate a minimap of the current document.
 * The script does not take sections into account.
 *
 * @return {object} Minimap Contructor.
 */
(function() {
    'use strict';

    /**
     * Header contructor
     *
     * @param {Object} domObject DOM object.
     */
    function Header( domObject ) {
        if ( !( this instanceof Header ) ) {
            return new Header();
        }

        this.dom     = domObject;
        this.$target = $( domObject );
    }

    /**
     * Fetch and add data to object.
     *
     * @return {Header}
     */
    Header.prototype.fetchHeaderData = function fetchHeaderData() {
        var header = this;

        header.tag   = header.dom.tagName.toLowerCase();
        header.title = header.$target.html();
        header.top   = header.$target.offset().top;

        return header;
    };

    /**
     * Compute the top position of a header in percentage.
     *
     * @return {Header}
     */
    Header.prototype.percentTop = function percentTop() {
        var header    = this;
        var $document = $( document );

        header.top = header.top * 100 / $document.innerHeight();

        return header;
    };

    /**
     * Build the DOM structure for minimap headers and existing headers.
     *
     * @param  {Integer} index Index allowing to differentiate the header.
     * @return {Header}
     */
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
     *
     * @return {Minimap}
     */
    function Minimap() {
        if ( !( this instanceof Minimap ) ) {
            return new Minimap();
        }
    }

    /**
     * Build the minimap.
     *
     * @return {Minimap}
     */
    Minimap.prototype.build = function build() {
        var minimap = this;

        this.headers  = [];
        this.$headers = $( 'h1, h2, h3, h4, h5, h6' );

        this.$headers.each( function( index, header ) {
            var $item = $( '<li>' ).append( new Header( header ).build( index ).$ );

            minimap.headers.push( $item );
        });

        this.$ = $( '<ul>', {
            'class': 'c-minimap'
        });

        $( 'body' ).prepend( this.$.append( minimap.headers ) );

        return minimap;
    };

    /**
     * Initialize Minimap.
     *
     * @return {Minimap}
     */
    Minimap.prototype.init = function init() {
        var minimap = this;

        minimap.build();

        return minimap;
    };

    return new Minimap().init();
})();
