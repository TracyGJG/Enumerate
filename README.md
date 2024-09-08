# Enumerate

A utility for the generation of Enumated values

## Use Cases

1. Convert literal constants into reference values.
2. Creation of function maps as an alternative to using `switch/case` blocks.
3. Generate a set of ordinal values.

The module is supplied as the default export of the library, so can be given a name appropriate to the context of use but, for our purposes, we will assume the module will be imported as `Enumerate`.

---

## Conversion of literal constants

Instead of something like:

```js
confirmationDialog.visible = true;
```

we want to be able to use:

```js
confirmationDialog.visible = Dialog.SHOW;
```

This would mean, should the underlying implmentation of the dialog changed and the expected value of the `visible` property change from Boolean to a number (true => 1, false => 0), only the constant reference need reflect the change.

To create the `Dialog` enumeration we use the following call:

```js
const Dialog = Enumerate.constants({
  SHOW: true,
  HIDE: false,
});
```

Ideally, the `constants` method will also ensure the values of `SHOW` and `HIDE` could not be changed usign the `Object.freeze` method.

The names of the generated constants will be reformatted if they contain lowercase characters. E.g. `hideDialog` will become `HIDE_DIALOG`.

---

## Creation of function maps

Most programming languages have a multiple-choice structure such as the `switch/case` statements in JavaScript. Whilst there is nothing intrinsically wrong with the mechanism there is potential for errors to arise if not implemented properly or poorly maintained. However, when `case` values map to specific functions many of these issues can often be avoided through the use of a function map.

The `Enumerate.functionMap` method provides a convenient mechanism for constructing a function map with a fallback should a supplied value fail to map.

```js
const mockFallback = _ => _;

const mappedFunctions = Enumerate.functionMap(
  {
    worked: _ => _.toUpperCase(),
  },
  mockFallback
);

mappedFunctions('worked')('test'); // TEST

mappedFunctions('failed')('test'); // test
```

If no fallback is provided and mapping not achieved an exception will be thrown to indicate what value was attempted.

---

## Generate a set of ordinal values

A very common construct in software is a collection of ordinal values. A set of constants with predefined and fixed values such as days of the week or months of the year.

```js
const DAYS_OF_THE_WEEK = Enumerate.ordinals([
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
]);

console.log(DAYS_OF_THE_WEEK.WED < DAYS_OF_THE_WEEK.MON); // false
console.log(DAYS_OF_THE_WEEK.WED < DAYS_OF_THE_WEEK.FRI); // true
```

The `ordinals` method will apply a zero-based increamental value by default but this can be overridden by providing a mapping function as the second parameter.

---
