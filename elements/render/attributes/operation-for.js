import { connectElements } from "..";
import { getForBetween, getStringBetween, strToPath } from "../../utils/regex";
import { connectTextNodesV2 } from "./text";

// <div for="let item of items; let i = $index" >
export const connectIndex = function (elements) {};
export const connectForLoop = function (
  $element,
  $instance,
  replacement = "this."
) {
  // Step 0: Extract element information
  if ($element.didBindForLoop) return;
  $element.didBindForLoop = true;

  let forLoopQuery = $element.getAttribute("for");
  let replacements = [];
  let forLoopParameters = {
    index: "$index",
    argumentFor: "",
    argumentOf: "",
  };
  $element.removeAttribute("for");

  // Step 1: Create comment placeholder and place it before the element itself
  let $comment = document.createComment(" for loop placeholder ");
  $comment.controller = $instance || $element.controller;
  $comment.replacement = replacement;
  $comment.template = $element.cloneNode(true);
  $comment.placeholder = $element.cloneNode(false);
  $comment.content = $comment.template.innerHTML.trim();
  $comment.items = [];
  $comment.subscriptions = [];
  $comment.forLoopQuery = forLoopQuery;
  $comment.replacements = replacements;
  $comment.forLoopParameters = forLoopParameters;

  $element.before($comment);
  $element.remove();

  // Step 2: Extract the loop parameters
  $comment.forLoopParameters = extractLoopParameters(
    $comment.forLoopQuery,
    $comment.replacement
  );

  // Step 3: Generate the template boilerplate
  $comment.replacements = extractReplacements(
    $comment.content,
    $comment.forLoopParameters
  );

  // Step 4: Create a subscription
  let path = getPath($comment.forLoopParameters); //.join(".");
  $comment.renderedItems = [];
  $comment.render = function () {
    const { success, object } = getOfItems($instance, path);
    if (success) {
      clearTimeout($comment.renderTimeout);
      $comment.renderTimeout = setTimeout(() => {
        let ouids = [object._uid]
        let uids = $comment.items.map(el => el?.forLoopData?._uid || -1);
        let items = [];
        let i = 0;
        for(let key of Object.keys(object)) {
          console.log(key,'here')
          ouids.push(object[key]._uid)
   
          if(uids.indexOf(object[key])> -1){
            items.push($comment.items[uids.indexOf(object[key])])
          }else{
            findOrCreateItem($instance,$comment,i)
            $comment.items[i].forLoopData= object[key] ; [];
            //$comment.items[i].forLoopData.push(object[key]);
            items.push($comment.items[i])
            // $comment.forLoopData.push(object[key]._uid)
          }
          
          i++;
        }
        $comment.items.sort((a,b) => a.forLoopData._uid < b.forLoopData._uid ? 1: -1)
        console.log($comment.items)
        debugger;
        $comment.items.map($item => $comment.before($item));
        let ok = Object.keys(object).map(k => object[k]._uid);
        for(let c of $comment.items){
          if(ok.indexOf(c?.forLoopData?._uid) == -1 ){
            c.remove();
            console.log('removed',c,ok.indexOf(c?.forLoopData?._uid))
          }
          //console.log($comment.items.map(el => el.forLoopData._uid))
        }
        console.log($comment.items)
        for(let $i of $comment.items){
          if(!$i.isConnected){
            $i.__subscriptions?.map(s => s.unsubscribe());
            $i.__subscriptions = [];
            
          }
        }
        $comment.items = $comment.items.filter(item => item.isConnected);
        $comment.items.sort((a,b) => a.forLoopData > b.forLoopData)
     
        
        /*
        for
        if($comment.items.length > 0) {
          // console.log(object,Object.keys(object))
          console.log(ouids)
          console.log($comment.items)
          debugger;
          console.clear();
        }else{
          
          console.log(object,_uid)
        }
        $comment.items =
          $comment.items.filter((el) => ouids == el.forLoopData > -1) ||
          [];
        uids = $comment.items.map((el) => el.forLoopData);
        console.log({ ouids, uids });

        let i = 0;
        for (let o of object) {
          let idx = uids.indexOf(object._uid);
          let $item;
          console.log(uids,object._uid);
          if (idx == -1) {
            $item = findOrCreateItem($instance, $comment, i);
            $item.forLoopData = object._uid;
          } else {
            $item = $comment.items[idx];
          }
          $item.$index = i;
          i++;
        }

        for (let i = object.length; i < $comment.items.length; i++) {
          $comment.items[i].remove();
          $comment.items[i].subscriptions.map((s) => s.unsubscribe());
          $comment.items[i].subscriptions = [];
        }

        $comment.items = $comment.items.slice(0, object.length);
        console.log($comment.items);
        // const $renderedItems = $comment.items;

        // const arrayKeys = Object.keys(object).map((k) => parseInt(k));
        // for (let $ri of $renderedItems) {
        //   if ($ri && $ri.remove) {
        //     $ri.remove();
        //   }
        // }
        $comment.renderedItems = $comment.items;

        // for (let key of arrayKeys) {
        //   const $item = findOrCreateItem($instance, $comment, key);
        //   if ($item != $comment.renderedItems[key]) {
        //     $comment.renderedItems[key] = $item;
        //   }
        for (let $item of $comment.items) {
          if (!$item.isConnected) {
            $comment.before($item);
          }
        }
        */
      }, 1);
    } else {
      console.warn($instance, path);
    }
  };

  if (isPathArray($instance, path)) {
    let eventName = path.join(".");

    $comment.subscriptions.push(
      $instance.__connector(eventName, function () {
        $comment.render();
      })
    );
    eventName = eventName + ".length";
    $comment.subscriptions.push(
      $instance.__connector(eventName, function () {
        console.log("len changed", $comment);
        $comment.render();
      })
    );
    $comment.render();
  }
  connectElements($instance);
};

export const extractLoopParameters = function (
  forLoopQuery,
  replacement = "this."
) {
  let queryArguments = forLoopQuery.split(";").map((el) => el.trim());

  // if is for="argumentFor of argumentOf;" We can only extract these two

  let queryString = queryArguments[0];
  let indexString = "$index";
  let forAttribute = "";
  let ofAttribute = "";
  if (queryArguments.length > 1) {
    queryString = queryArguments[0];
    indexString = queryArguments[1];
    indexString = indexString.split("=").map((el) => el.trim());
    indexString = indexString[0].trim().split(" ");
    indexString = indexString[indexString.length - 1];
  } else {
    queryString = queryArguments[0];
  }
  queryString = queryString
    .trim()
    .split(" of ")
    .map((el) => el.trim());

  ofAttribute = queryString[1];
  ofAttribute =
    ofAttribute.indexOf(replacement) == 0
      ? ofAttribute
      : replacement + ofAttribute;
  forAttribute = queryString[0]
    .split(" ")
    .filter((fa) => fa.length > 0)
    .filter((f) => ["const", "let", "var"].indexOf(f) == -1)[0];

  let forLoopParameters = {
    index: indexString,
    forAttribute: forAttribute,
    ofAttribute: ofAttribute,
  };
  return forLoopParameters;
};
export const extractReplacements = function (content, forLoopParameters) {
  let replacements = getStringBetween(content).map((replacement) => {
    return {
      original: `{{${replacement}}}`,
      replaced:
        "{{" +
        replacement.replaceAll(
          forLoopParameters.forAttribute,
          forLoopParameters.ofAttribute + "[${" + forLoopParameters.index + "}]"
        ) +
        "}}",
    };
  });
  return replacements;
};

export const isPathArray = function ($instance, path = []) {
  let success = true;
  let loop = $instance;
  for (let p of path) {
    if (!loop.hasOwnProperty(p)) {
      return false;
    } else {
      loop = loop[p];
    }
  }
  return Array.isArray(loop);
};

export const getPath = function (forLoopParameters) {
  return forLoopParameters.ofAttribute
    .replaceAll("[", ".")
    .replaceAll("]", ".")
    .replaceAll("..", ".")
    .trim(".")
    .split(".")
    .slice(1);
};
export const getOfItems = function ($instance, path = []) {
  let loop = $instance;

  let failed = false;
  let localpath = "";

  for (let p of path) {
    localpath = localpath + " > " + p;

    if (!loop.hasOwnProperty(p)) {
      failed = true;
      break;
    }
    // failed = true;

    loop = loop[p];
  }

  return {
    success: !failed,
    object: loop,
    path: path,
  };
};
export const findOrCreateItem = function ($instance, $comment, index) {
  let $item = $comment.items[index];

  if (!$item) {
    $item = $comment.placeholder.cloneNode(true);
    $item.controller = $instance;
    let html = $comment.template;

    if (typeof html === "object") html = html.innerHTML;

    for (let replacement of $comment.replacements) {
      html = html.replaceAll(replacement.original, replacement.replaced);
    }

    let forBetweens = getForBetween(html);

    for (let fb of forBetweens) {
      html = html.replaceAll(
        fb,
        fb.replaceAll(
          $comment.forLoopParameters.forAttribute,
          $comment.forLoopParameters.ofAttribute +
            "[${" +
            $comment.forLoopParameters.index +
            "}]"
        )
      );
    }

    html = html.replaceAll(
      "${" + $comment.forLoopParameters.index + "}",
      index
    );
    html = html.replaceAll(" $index ", index);

    html = html.replaceAll(" " + $comment.forLoopParameters.index + " ", index);

    $comment.before($item);

    $item.innerHTML = html;
    $item.$index = index;
    $item.classList.add("for-item");

    $comment.items[index] = $item;
    $item.customParameters = $item.customParameters ?? {};
    $item.customParameters = {
      $index: $comment.forLoopParameters.index,
    };
    [...$item.querySelectorAll("*")].forEach(($el) => {
      $el.forLoopData = $el.forLoopData ?? {
        index: [],
        $item: $item,
      };
      $el.forLoopData.index.push(index);
    });

    const nestedLoops = [];

    let $nests = [...$item.querySelectorAll("* > [for]")];
    for (let $nest of $nests) {
      if ($nest) {
        connectForLoop($nest, $instance);
      }
    }

    try {
      connectTextNodesV2($item, true);
    } catch (ex) {
      console.warn(ex);
    }
    $item.remove();
  }
  return $item;
};

(function () {
  var id = 0;
  Object.defineProperty(Object.prototype, "_uid", {
    // The prototype getter sets up a property on the instance. Because
    // the new instance-prop masks this one, we know this will only ever
    // be called at most once for any given object.
    get: function () {
      if (typeof this === "object" && this != null) {
        Object.defineProperty(this, "_uid", {
          value: id++,
          writable: false,
          enumerable: false,
        });
        return this._uid;
      }
    },
    enumerable: false,
  });
})();
