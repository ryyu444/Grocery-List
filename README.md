__Ryan's Branch__

# Video Source [title](https://youtu.be/3PHXvlpOkf4?t=23492)

1. Likely not the best way of doing this
2. Still need to work with front-end to integrate classes & such
3. So many methods and properties...

```
function head_empty = (tired, work) => {
    if (tired || work >= 0.5) {
        return true;
    }

    if (!tired || work < 0.5) {
        return false;
    }
}

TEST(Brain, head_empty) {
    ASSERT_EQ(true, head_empty(true, 0.6));
}
```
---
