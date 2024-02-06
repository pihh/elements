export const extractEvent = function ($instance, $attribute) {
  $attribute.replaceAll("(", "").replaceAll(")", "").trim(); //.slice(2);
  if (
    $attribute.startswith("on") &&
    typeof $instance[$attribute.slice(2)] !== "function"
  ) {
    return $attribute.slice(2);
  } else {
    return false;
  }
};

export const extractArguments = function ($instance, $value) {
  let $split = $value.split("(");
  if ($split.length > 1) {
    $split = $split[1]
      .split(")")[0]
      .split(",")
      .map(($s) => $s.trim())
      .map((attr) => ($instance[attr] != undefined ? "this." + attr : attr)); //.split(',');
  } else {
    $split = ["$event"];
  }
  return $split;
};

export const extractMethodAndArguments = function (
  $instance,
  $el,
  $attribute,
  $expression
) {
  const $actions = $instance.observedActions || [];
  const $split = $expression.split("(");
  let $methodName = $split.filter(($s) => {
    // let declarations = $s.split(")");
    // if(declarations.length > 0){

    // }
    // if(right.length > 0){
    //     [0].trim().split(" ")[0]
    return (
      "function" == typeof $instance[$s.split(")")[0].trim().split(" ")[0]]
    );
  }); //$split.length > 1 ? $split[1] : $split[0]
  if ($methodName[0]) {
    $methodName = $methodName[0];
    let $fn = extractEvent($instance, $attribute);
    if ($fn) {
      $el.addEventListener($fn, function (e) {
        console.log("action", e, extractArguments($instance, $expression));
      });
    }
    //   if($actions.indexOf($methodName)> -1){
    //     console.log('is action');

    //     $el.addEventListener($attribute.replaceAll('(','').replaceAll(')','').trim().slice(2),function(e){
    //       console.log('action',e,$split)
    //     })
  } else {
    // $el.addEventListener($attribute.replaceAll('(','').replaceAll(')','').trim().slice(2),function(e){
    //   console.log('local',e,$split[1].replaceAll(')','').split(',').map(arg => arg.trim()))
    // })
  }
};
