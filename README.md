## react-native-grading

react-native-grading is a RN component for users to grade scores. Four modes are supplied by the component, `arcs`/`simles`/`stars`/`board`.

## Example.gif

## Before Using: Link ART in Xcode
Using this component directly in your project may encounter the following error:
> No component found for view with name "ARTSurfaceView"

First find `ART.xcdoeproj` from `your-project/node_modules/react-native/Libraies/ART/ART.xcdoeproj` and drag it into Xcode `your-project/Libraries`.

Then turn to the project's General Settings and add `libART.a` into the **`Linked Frameworks and Libraries`** list.

Finally, press cmd + B to rebuild project.


## Usage

```js
import Grading from 'react-native-grading';
```

**board mode (Default)**

```html
<Grading score={4.0} num={72346} fontColor="#552da6" readOnly={true}/>
```

**stars mode**

```html
<Grading
  mode="stars"
  scale={2.4}
  score={this.state.stars.score}
  scoreBase={10}
  activeColor={customActiveColor}
  defaultColor={customDefaultColor}
  onGrading={this.changeStarScore}
/>
```

**arcs mode**

```html
<Grading
  mode="arcs"
  score={this.state.arcs.score}
  scoreBase={10}
  activeColor="#2bb8aa"
  scale={1.2}
  onGrading={this.changeArcScore}
  name="Creativity"
  enable={true}
/>
```

**smiles mode**

```
<Grading mode="smiles" scale={1.2} activeColor="#d23f2b" isLike={this.state.simles.isLike} readOnly={true}/>
```



