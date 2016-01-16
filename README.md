
## compress image base canvas for javascript

##usage

```
$(':file').on('change',function(){
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function imgLoad(e) {
    window.compress(e.target.result, 1080, function(data){
        // data is new image
    });
  }
});
```


## compress
* `origin` base64 image data
* `width` integer width for compressed image
* `callback(data)` function


## Author
shanelau
