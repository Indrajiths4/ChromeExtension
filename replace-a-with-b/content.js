
  // content.js
  function shouldProcessElement(element) {
      // Skip common UI elements
      const skipTags = ['SCRIPT', 'STYLE', 'META', 'LINK', 'HEAD', 'BUTTON', 'INPUT'];
      const skipClasses = ['nav', 'header', 'footer', 'menu', 'toolbar', 'logo'];
      
      if (skipTags.includes(element.tagName)) return false;
      
      // Check element classes
      for (const className of skipClasses) {
          if (element.classList?.contains(className)) return false;
      }
      
      // Skip elements with role attributes typically used in UI
      const skipRoles = ['navigation', 'banner', 'toolbar', 'menu', 'button'];
      const role = element.getAttribute('role');
      if (role && skipRoles.includes(role)) return false;
      
      return true;
  }
  
  function replaceText(node) {
      // Skip if node is not an element or text node
      if (!node || (node.nodeType !== Node.TEXT_NODE && node.nodeType !== Node.ELEMENT_NODE)) {
          return;
      }
      
      // For text nodes, do the replacement
      if (node.nodeType === Node.TEXT_NODE && node.parentElement && 
          shouldProcessElement(node.parentElement)) {
          node.textContent = node.textContent
              .replace(/a/g, 'b')
              .replace(/A/g, 'B');
          return;
      }
      
      // For element nodes, process their children if appropriate
      if (node.nodeType === Node.ELEMENT_NODE && shouldProcessElement(node)) {
          node.childNodes.forEach(replaceText);
      }
  }
  
  // Wait for the page to load
  window.addEventListener('load', () => {
      // Process initial content
      const mainContent = document.body;
      if (mainContent) {
          replaceText(mainContent);
      }
      
      // Observer for dynamic content
      const observer = new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
              mutation.addedNodes.forEach(replaceText);
          });
      });
      
      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });