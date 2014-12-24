// Create an immediately invoked functional expression to wrap our code
(function() {

    // Define our constructor
    this.Modal = function() {
        // Create global element references
        this.closeButton = null;
        this.modal = null;
        this.overlay = null;

        // Determine proper prefix
        this.transitionEnd = transitionSelect();

        // Define option defaults
        var defaults = {
            autoOpen: false,
            className: 'fade-and-drop',
            closeButton: true,
            content: "",
            maxWidth: 600,
            minWidth: 280,
            overlay: true
        };

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }

        if(this.options.autoOpen === true) this.open();

    };

    // react convertion
    // ================
    var CloseButton = React.createClass({
        render: function() {
            return (
                <button class="scotch-close close-button">x<button>
            );
        }
    });

    var KodaModalOverlay = React.createClass({
        render: function() {
            return (
                <div class="scotch-overlay {this.options.classname}"><div>
            );
        }
    });

    var KodaModalContent = React.createClass({
        render: function() {
            return (
                <div class="scotch-content">
                    {this.state.content}
                <div>
            );
        }
    });

    var KodaModal = React.createClass({
        render: function() {
            var content, contentHolder, docFrag;

            if (typeof this.options.content === "string") {
                content = this.options.content;
            } else {
                content = this.options.content.innerHTML;
            },
            return (
                <div class="scotch-modal {this.options.classname}">
                <KodaModalContent />
                // If closeButton option is true, add a close button
                if (this.options.closeButton === true) {
                    <CloseButton />
                }
                <div>
            );
        }
    });

    React.render(
        <KodaModal />,
        <KodaModalOverlay />,
        document.getElementById('content')
    );

    // Public Methods
    // ===============

    Modal.prototype.open = function() {
        // Build out our Modal
        <KodaModal />

        // Initialize our event listeners
        initializeEvents.call(this);

        /*
        * After adding elements to the DOM, use getComputedStyle
        * to force the browser to recalc and recognize the elements
        * that we just added. This is so that CSS animation has a start point
        */
        window.getComputedStyle(this.modal).height;

        /*
        * Add our open class and check if the modal is taller than the window
        * If so, our anchored class is also applied
        */
        this.modal.className = this.modal.className + (this.modal.offsetHeight > window.innerHeight ? " scotch-open scotch-anchored" : " scotch-open");
        this.overlay.className = this.overlay.className + " scotch-open";

    };

    Modal.prototype.close = function() {
        // Store the value of this
        var _ = this;

        // Remove the open class name
        this.modal.className = this.modal.className.replace(" scotch-open", "");
        this.overlay.className = this.overlay.className.replace(" scotch-open", "");

        /*
        * Listen for CSS transitionend event and then
        * Remove the nodes from the DOM
        */
        this.modal.addEventListener(this.transitionEnd, function() {
            _.modal.parentNode.removeChild(_.modal);
        });
        this.overlay.addEventListener(this.transitionEnd, function() {
            if(_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
        });

    };

    // Private Methods
    // ===============

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    function initializeEvents() {

        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.close.bind(this));
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', this.close.bind(this));
        }

    }

    // Utility method to determine which transistionend event is supported
    function transitionSelect() {
        var el = document.createElement("div");
        if (el.style.WebkitTransition) return "webkitTransitionEnd";
        if (el.style.OTransition) return "oTransitionEnd";
        return 'transitionend';
    }




}());
