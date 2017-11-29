# Premium Partner Portal


### Routing & Naming

file: `configureRoutes.js`


| slug        | Component           | Reducer  | Prefix |
| ------------- |:-------------:| -----:|-----:|
| /		        | [redirect to /content] |  | |
| /content      | `DashboardPageMediator.js`      |  `reducers/dashboard.js` | Dashboard|
| /performance | `PerformancePageMediator.js`      |   `reducers/performance.js` |Performance|
| /reports | `LeadDataPageMediator.js`      |    `reducers/leadData.js` | LeadData|


Each component will be _prefixed_, unless it's general purpose.

> **Use the chrome inspector to find DOM elements and the CSS class: this is the name 
> of the component file/folder**


## Development

### Run

From root, in one shell...

`npm i`

`npm start`

In another... `node index.js` 

For using:

- login

- `/api/userheartsjoin`

- `/api/vbschools`


There are some constants like IPEDS in `webpack.config.js` 


##### [CMS](https://github.com/VestedInc/schoold-cms/tree/premium_partner)

Used for any writing to databases. [Api's here](https://github.com/VestedInc/schoold-cms/blob/premium_partner/routes/premium-partner.js)

`node bin/www.js`

The table with everything is in the 'vbdash' database called _PremiumPartner_

----

### Premium Partner component

Clone [the repo](https://github.com/VestedInc/premium_partner) somewhere outside of this repo and run `npm link` from inside _premium_partner_ repo

Then, from inside this repo run: `npm link premium_partner`. This will symlink your system copy into node_modules. You will have to do this everytime you do anything to npm - it's a bug.

It is imported from  `DashboardPageContainer.jsx`. The data comes from the api. `apiSaga.jsx`


### JS

#### Key notes

- Entry is `index.jsx`

- Redux store files: `index.jsx` & `configureStore.js`


- `AppPageContainer.jsx` is loaded by `AppPageMediator.jsx` initially. Authentication is checked [here](https://github.com/VestedInc/vbdash/blob/partner-portal/client/src/js/containers/AppPageContainer/AppPageContainer.jsx#L41) against the [auth reducer](https://github.com/VestedInc/vbdash/blob/partner-portal/client/src/js/reducers/auth.js).

- Action TYPES are in `actions/actionTypes.js`





#### Containers & Components

- `/containers` : reservered as stateful React components that figure into the _ 
 _routing_ invoked by the `/mediators`


- `/components`: a mixture of stateful Components and PureComponents


Example from `ModalComponent.jsx` with notes:

**`/selectors`**: they let you compose props from the components using all the reducers

```
const mapStateToProps = () => {
	
 //these are `/selectors`: 
  const getModalConfirmation = makeGetModalConfirmation()
  const getSelectedTile = makeGetSelectedTile()
  
  
  return (state, ownProps) => {
    return {
      ...ownProps,
      
      /* Sometimes just these are exported and can be used without the 'make' */
      selectedTile: getSelectedTile(state), 
      modalConfirmation: getModalConfirmation(state),
      
	   /* Only pass what you need down */
      
      dashboard: state.dashboard,
      components: state.components,
    }
  }
}
```

#### Notes

If re-renders are not happening, check what is happening in
`shouldComponentUpdate(nextPros, nextState){}`. Can be great for performance to do checks and `return false`. But is also cause for frustration when adding new bits.
[CalendarComponent](https://github.com/VestedInc/vbdash/blob/partner-portal/client/src/js/components/CalendarComponent/CalendarComponent.jsx#L67) has a big one.






## CSS

A mixture of SASS and PostCSS. See the loaders [webpack config](https://github.com/VestedInc/vbdash/blob/partner-portal/webpack.config.js#L41)

The options are configured [here](https://github.com/VestedInc/vbdash/blob/partner-portal/webpack.config.js#L247)

Inside the js there is a file: `utils/styling.js`

`index.jsx`:

```
import './index.scss';
import './index.css';
```

- SASS is used to import or override css from external modules.

`_application.scss` :

Example of importing : 

```
@import "../../../node_modules/react-table/react-table.css";
@import "../../../node_modules/hamburgers/dist/hamburgers.css";
@import "../../../node_modules/react-select/dist/react-select.css";
@import "../../../node_modules/react-dates/lib/css/_datepicker.css";

```

Example of overriding: 

```
@import 'site/components/react-dates';
```

- PostCSS is used with components.

[Webpack option](https://github.com/VestedInc/vbdash/blob/partner-portal/webpack.config.js#L258) loads [this file](https://github.com/VestedInc/vbdash/blob/partner-portal/postcss.config.js). Every `.css` file loaded in will run through the config. 


`ActionButtonComponent.jsx` + `ActionButtonComponent.css` + notes:

```

	/*
		Classes and var() are availble to this component
	*/
@import "vars/colors";
@import "vars/sizes";
@import "site/components/button";
@import "site/components/icons";


	/*
		Specific to this component
	*/
:root {
  --padding: 1.3em;
  --padding-sm: 0.3em;
}

.root {
	
  @extend %button;    //available from "site/components/button";
  padding-left: var(--padding);
  padding-right: var(--padding);
  
  ...
  
  i {
    @extend %text-icons; //available from "site/components/text";
    padding-right: var(--padding);
  }
  
 /*
	 Apply in js like styles['root__label']
 */
  &__label {
    color: var(--c-text);
	
	 /*
		 Apply in js like styles['root__label--nopadding']
	 */	 
    &--nopadding {
      padding: 0;
    }
  }
}

...


```

###### Media Queries

Activate changes on classes based on browser.

Define the dimensions in the [postcss-config](https://github.com/VestedInc/vbdash/blob/partner-portal/postcss.config.js#L55)

```
"--phone": "(min-width: 360px)", 
"--phablet": "(min-width: 540px)",
"--tablet": "(min-width: 768px)",
"--tablet-max": "(max-width: 768px)", //**** Everything BELOW this will be affected
"--desktop": "(min-width: 992px)",
"--large-desktop": "(min-width: 1200px)"
```                    

Example: `NavigationContainer.css`

```
@custom-media --tablet-max;
```

Always at the bottom to override...

```
/* Elements with class item will hide when viewport width is below 768px */
@media (--tablet-max) {
    .item {
        display: none;
    }
}
```
#### .sss files

A lot of npm packages use inline-styles on components eg: `style={{background:red}}`

There isn't much material UI left. Only the Mat UI `TextField` is used. [See their docs](http://www.material-ui.com/#/components/text-field)

Check `TextFieldComponent.jsx`. You'll see `extends PureMaterialUIComponent` instead


Example: `DashboardTextCaptionComponent.jsx` 

```
import styleObject from "components/UI/TextFieldComponent.sss"
```

```
		<TextFieldComponent
          className={[styles["root"]]}          
          style={merge(styleObject[".caption"])}
          onChange={this._onChange}
          floatingLabelStyle={styleObject[".floatingLabelStyle"]} //****override Mat-UI
          underlineStyle={styleObject[".underlineStyle"]} //****override Mat-UI
          hintText={
            isEmpty(selectedTile) ? "Write a caption here" : ""
          }
          defaultValue={selectedTile.caption}
          requiresPrompt={this.state.showRequiresPrompt}
          value={this.state.caption}
          inputStyle={styleObject[".inputStyle"]} //****override Mat-UI
          textareaStyle={styleObject[".textareaStyle"]} //****override Mat-UI
          multiLine={true}
          rows={browser.lessThan.tablet ? 2 : 1}
        />
```



### Notes

Use [nvm](https://github.com/creationix/nvm). This uses `.nvmrc` to use a new version of node. 

# Sublime JSPrettier

User preferences

```
{

    "prettier_cli_path": "/Users/Sam/.nvm/versions/node/v8.1.3/bin/prettier",
    "node_path": "/Users/Sam/.nvm/versions/node/v8.1.3/bin/node",
    
  "prettier_options": {
    "useTabs":false,
    "tabWidth":1,
    "printWidth": 70,
    "singleQuote": false,
    "trailingComma": "es5",
    "bracketSpacing": true,
    "jsxBracketSameLine": false,
    "parser": "babylon",
    "semi": false
  }
}

```


## Docs

[https://vestedfinance.atlassian.net/wiki/spaces/SPROD/pages/76713643/Premium+Partner+Portal+V2
](https://vestedfinance.atlassian.net/wiki/spaces/SPROD/pages/76713643/Premium+Partner+Portal+V2
)