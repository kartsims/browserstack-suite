var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Spec Model
 * =============
 */

var Spec = new keystone.List('Spec', {
  autokey: { from: 'name', path: 'key', unique: true }
});

Spec.add({
  name: { type: String, required: true },
  browsers: { type: Types.Relationship, ref: 'Browser', many: true },
  createdAt: { type: Date, default: Date.now, noedit: true }
});

Spec.defaultColumns = 'name, browsers|75%';
Spec.relationship({ ref: 'App', path: 'spec' });
Spec.register();
