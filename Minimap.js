/* global $ */
/* eslint consistent-this: ["error", "minimap"] */
/* eslint id-length: ["error", { "exceptions": ["$"] }] */

/**
 * Generate a minimap of the current document.
 * The script does not take sections into account.
 *
 * @return {object} Minimap Contructor.
 */
( function Minimaper () {
    'use strict';

    /**
     * Header contructor
     *
     * @param {Object} domObject DOM object.
     * @return {mixed} Header Instance | undefined.
     */
    function Header ( domObject ) {
        if ( !( this instanceof Header ) ) {
            return new Header( domObject );
        }

        this.dom     = domObject;
        this.$target = $( domObject );
    }

    /**
     * Fetch and add data to object.
     *
     * @return {Header} Header Instance
     */
    Header.prototype.fetchHeaderData = function fetchHeaderData () {
        this.tag   = this.dom.tagName.toLowerCase();
        this.title = this.$target.html();
        this.top   = this.$target.offset().top;

        return this;
    };

    /**
     * Compute the top position of a header in percentage.
     *
     * @return {Header} Header Instance
     */
    Header.prototype.percentTop = function percentTop () {
        const $document  = $( document );
        const MaxPerCent = 100;

        this.top = this.top * MaxPerCent / $document.innerHeight();

        return this;
    };

    /**
     * Build the DOM structure for minimap headers and existing headers.
     *
     * @param  {Integer} index Index allowing to differentiate the header.
     * @return {Header}  Header Instance
     */
    Header.prototype.build = function build ( index ) {
        this.fetchHeaderData();

        this.targetId = this.$target.attr( 'id' ) || `c-minimap__${ this.tag }-${ index }`;

        this.$target.attr( 'id', this.targetId );

        this.$root = $( '<a>', {
            title: this.title,
            class: `c-minimap__link c-minimap__${ this.tag }`,
            href:  `#${ this.targetId }`,
        } ).css( {
            top: `${ this.percentTop().top }%`,
        } );

        return this;
    };

    /**
     * Minimap contructor
     *
     * @return {Minimap} Minimap Instance.
     */
    function Minimap () {
        if ( !( this instanceof Minimap ) ) {
            return new Minimap();
        }
    }

    /**
     * Build the minimap.
     *
     * @return {Minimap} Minimap Instance.
     */
    Minimap.prototype.build = function build () {
        const minimap = this;

        this.headers  = [];
        this.$headers = $( 'h1, h2, h3, h4, h5, h6' );

        this.$headers.each( ( index, header ) => {
            const $item = $( '<li>' ).append( new Header( header ).build( index ).$root );

            minimap.headers.push( $item );
        } );

        this.$list = $( '<ul>', {
            class: 'c-minimap',
        } );

        this.$list.append( this.headers );

        this.$root = $( '<nav>', {
            role: 'navigation',
        } );

        $( 'body' ).prepend( this.$root.append( this.$list ) );

        return this;
    };

    /**
     * Initialize Minimap.
     *
     * @return {Minimap} Minimap Instance.
     */
    Minimap.prototype.init = function init () {
        this.build();

        return this;
    };

    return new Minimap().init();
}() );
