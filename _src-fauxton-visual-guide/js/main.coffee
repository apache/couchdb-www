$ ->
  
  toc = $('#toc')
  button = $('#toggle-toc-button')
  
  button.click ->
    toc.toggleClass('hidden')
    button.toggleClass('x')
    
    button.text ->
      if toc.hasClass('hidden') then 'TOC' 
      else 'X'