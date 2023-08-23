/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
import NodeDriver from 'shared/mixins/node-driver';

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/


/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import them via modules, since the dependencies exist in rancher we dont want to expor the modules in the amd def
const computed     = Ember.computed;
const get          = Ember.get;
const set          = Ember.set;
const alias        = Ember.computed.alias;
const service      = Ember.inject.service;
const hash         = Ember.RSVP.hash;

const defaultRadix = 10;
const defaultBase  = 1024;
/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/



/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(NodeDriver, {
  driverName: '%%DRIVERNAME%%',
  config:     alias('model.%%DRIVERNAME%%Config'),
  app:        service(),
  hetzner: service(),
  step: 1,

  init() {
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template      = Ember.HTMLBars.compile(decodedLayout, {
      moduleName: 'nodes/components/driver-%%DRIVERNAME%%/template'
    });
    set(this,'layout', template);

    this._super(...arguments);

  },
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

  // Write your component here, starting with setting 'model' to a machine with your config populated
  bootstrap: function() {
    // bootstrap is called by rancher ui on 'init', you're better off doing your setup here rather then the init function to ensure everything is setup correctly
    let config = get(this, 'globalStore').createRecord({
      type: '%%DRIVERNAME%%Config',
      apiToken: null,
      image: 'ubuntu-22.04',
      imageArch: null,
      imageId: null,
      serverType: 'cx21',
      serverLocation: '',
      existingKey: '',
      existingKeyId: null,
      additionalKeys: [],
            
      userData: '',
      volumes: [],
      networks: [],
      usePrivateNetwork: false,
      firewalls: [],
      serverLabels: [],
      keyLabes: [],
      placementGroup: '',
      autoSpread: false,
      sshUser: null,
      sshPort: null,
      primaryIPv4: null,
      primaryIPv6: null,
      waitOnError: 0,
      waitOnPolling: 1,
      waitForRunningTimeout: 0,
      disablePublic4: false,
      disablePublic6: false,
    });

    set(this, 'model.%%DRIVERNAME%%Config', config);
  },

  // Add custom validation beyond what can be done from the config API schema
  validate() {
    // Get generic API validation errors
    this._super();
    var errors = get(this, 'errors')||[];
    if ( !get(this, 'model.name') ) {
      errors.push('Name is required');
    }

    // Add more specific errors
    if (!this.get('model.%%DRIVERNAME%%Config.serverLocation')) {
      errors.push('Specifying a %%DRIVERNAME%% Server Location is required');
    }

    if (!this.validateCloudCredentials()) {
      errors.push(this.intl.t('nodeDriver.cloudCredentialError'));
    }


    

    // Set the array of errors for display,
    // and return true if saving should continue.
    if ( get(errors, 'length') ) {
      set(this, 'errors', errors);
      return false;
    } else {
      set(this, 'errors', null);
      return true;
    }
  },

  actions: {
    finishAndSelectCloudCredential(cred) {
      if (cred) {
        set(this, 'model.cloudCredentialId', get(cred, 'id'));

        this.send('authHetzner');
      }
    },
    authHetzner(cb) {
      const auth = {
        type: 'cloud',
        token: get(this, 'model.cloudCredentialId'),
      };
    }
  }

  // Any computed properties or custom logic can go here
});
