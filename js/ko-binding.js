
var koVal = ko.utils.unwrapObservable;

// Create stopBinding binding handler to allow separation of binding areas
//  No binding will continue into the interior of the elems which have the stopBinding handler.
//  The usage is to place this handler on an element that is outside of the content that shouldn't be bound.
//  The internal content may be bound seperately from other view models to enable this type of structure:
//    Outer Binding Area - bound to page's main model
//      Inner Binding Area surrounded by a "stopBinding" directive, which is bound outside of the main view model
ko.virtualElements.allowedBindings.stopBinding = true;
ko.bindingHandlers.stopBinding = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // Return property which states this element's descendents shouldn't be bound
        return { controlsDescendantBindings: true };
    }
};

// Specify randomOrder can be used on virtual elements
ko.virtualElements.allowedBindings.randomOrder = true;
// Create randomOrder binding handler, simply re-orders the child elements where it is placed
ko.bindingHandlers.randomOrder = {
    init: function(elem) {
        // Build an array of child elements
        var child = ko.virtualElements.firstChild(elem),
            childElems = [];
        while (child) {
            childElems.push(child);
            child = ko.virtualElements.nextSibling(child);
        }

        // Remove them all, then put them back in a random order
        ko.virtualElements.emptyNode(elem);
        while(childElems.length) {
            var randomIndex = Math.floor(Math.random() * childElems.length),
                chosenChild = childElems.splice(randomIndex, 1);
            ko.virtualElements.prepend(elem, chosenChild[0]);
        }
    }
};

ko.bindingHandlers.validate = {
    init: function(elem, valueAccessor) {

    },
    update: function(elem, valueAccessor) {

    }
};

// Allow binding via different "ko-" attributes that specify the binding handler in the name, like "ko-text".
// Sometimes this is a simpler syntax and the attribute stands for the functionality being used
// Simple example:
//          <div ko-text="Variable"></div>
//      This would be converted to:
//          <div data-bind="text: Variable"></div>
// Example with multiple and object value:
//          <div ko-if="showComponent" ko-component="{ name: 'abc', params: {} }"></div>
//      The two ko- attributes would combine in the data-bind attribute, adding to any existing bindings
//          <div data-bind="if: showComponent, component: { name: 'abc', params: {} }"></div>
ko.bindingProvider.instance.preprocessNode = function(node) {
    var e = $(node);
    var removeAttribs = [];
    var dataBindAttribs = [];
    $(node.attributes).each(function() {
        var match = this.name.match(/^ko-(.*)$/);
        if (match) {
            dataBindAttribs.push([match[1], this.value]);
            removeAttribs.push(this.name);
        }
    });

    if (dataBindAttribs.length > 0) {
        var currentBinding = e.attr('data-bind') || '';

        $(dataBindAttribs).each(function() {
            var key = this[0];
            var val = this[1];
            //console.log('Data bind ' + key + ' : ' + val);
            var bindingExpression = key + ': ' + val;
            if (currentBinding == '')
                currentBinding = bindingExpression;
            else
                currentBinding = currentBinding + ', \n' + bindingExpression;
        });

        $(removeAttribs).each(function() {
            e.removeAttr(this);
        });
        e.attr('data-bind', currentBinding);
    }
};

// ko.components.register('component-empty', {
//     viewModel: function(params) { },
//     template: '<span></span>'
// });
