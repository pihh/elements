import { findTextNodes } from "..";
const $attribute = "*skip";
const $className = "the-skip-element";
export const parseSkipAttribute = function($attrs, $el) {
  if ($attrs.indexOf($attribute) > -1) {
    $el.removeAttribute($attribute);
    $el.classList.add($className);
    [...$el.querySelectorAll("*")].forEach(($child) => {
      $child.classList.add($className);
    });
    const $nodes = findTextNodes($el);
    for(let $node of $nodes) {
        $node.skip = true;
        console.log($node)
    }
  }
  return $el.classList.contains($className);
}

/*
      const bindForLoop = function (
        $element,
        $instance,
        $replacement = "this."
      ) {
        if (!$element.forLoopCalled) {
          $element.removeAttribute("id");
          $element.forLoopCalled = true;

          // CONNECT THIS COMMENT TO THE ARRAY LENGTH
          $comment = document.createComment(" for loop placeholder ");
          $comment.forLoopQuery = $element.getAttribute("for");
          $comment.items = [];
          $element.removeAttribute("for");
          $element.classList.remove("for-item");

          $comment.forLoopElement = $element.cloneNode(true);
          $comment.forLoopTemplate = $comment.forLoopElement.innerHTML;
          $element.before($comment);

          $element.remove();

          // Extract query arguments;
          $comment.forLoopParams = {
            index: "$index",
            forAttribute: "",
            offAttribute: "",
          };

          let queryArguments = $comment.forLoopQuery
            .split(";")
            .map((el) => el.trim());
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
            ofAttribute.indexOf($replacement) == 0
              ? ofAttribute
              : $replacement + ofAttribute;
          forAttribute = queryString[0]
            .split(" ")
            .filter((fa) => fa.length > 0)
            .filter((f) => ["const", "let", "var"].indexOf(f) == -1)[0];

          $comment.forLoopParams = {
            index: indexString,
            forAttribute: forAttribute,
            ofAttribute: ofAttribute,
          };

          const $item = $comment.forLoopElement.cloneNode(true);
          $comment.replacements = getStringBetween($item.innerHTML).map(
            (replacement) => {
              return {
                original: `{{${replacement}}}`,
                replaced:
                  "{{" +
                  replacement.replaceAll(
                    $comment.forLoopParams.forAttribute,
                    $comment.forLoopParams.ofAttribute +
                      "[${" +
                      $comment.forLoopParams.index +
                      "}]"
                  ) +
                  "}}",
              };
            }
          );

          $comment.parseItem = function (index) {
            const $item = $comment.forLoopElement.cloneNode(true);
            let html = $item.innerHTML;
            for (let replacement of $comment.replacements) {
              
              html = html.replaceAll(
                replacement.original,
                replacement.replaced
              );
            }
            html = html.replaceAll("{{$index}}", index);
            const forBetweens = getForBetween(html);

            for (let fb of forBetweens) {
           
              html = html.replaceAll(
                fb,
                fb.replaceAll(
                  $comment.forLoopParams.forAttribute,
                  $comment.forLoopParams.ofAttribute +
                    "[${" +
                    $comment.forLoopParams.index +
                    "}]"
                )
              );
            }

            html = html.replaceAll(
              "${" + $comment.forLoopParams.index + "}",
              index
            );

            $item.innerHTML = html;
            $item.$index = index;
            $item.classList.add("for-item");
            $item.id = "";
            $comment.items = $comment.items || [];
            $comment.items.push($item);

            return $item;
          };

          try {
            const path = $comment.forLoopParams.ofAttribute
              .replaceAll("[", ".")
              .replaceAll("]", ".")
              .replaceAll("..", ".")
              .trim(".")
              .split(".")
              .slice(1);

            let loop = $instance;
            for (let p of path) {
              loop = loop[p];
            }

            for (let i in loop.toReversed()) {
              $child = $comment.parseItem(loop.length - 1 - i);

              $comment.after($child);
            }
          } catch (ex) {}

          //
          for (let $child of $comment?.items?.toReversed()) {
            //let $next = undefined

            let $nexts = [...$child.querySelectorAll("* > [for]")];

            for (let $next of $nexts) {
              if ($next) {
                bindForLoop($next, $instance);
              }
            }
          }
        }
      };
      */