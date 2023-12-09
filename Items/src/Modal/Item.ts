import mongoose from 'mongoose';

interface ItemAttrs {
  itemCategory: string;
  itemName: string;
  itemDescription: string;
  itemOwner: string;
  itemImages: [string];
  itemStatus: string;
  lostLocation: {
    type: string;
    coordinates: [number, number];
  };
  lostDate: Date;
  lostTime: Date;
}

const ItemSchema = new mongoose.Schema({
  itemCategory: {
    type: String,
    required: [true, 'Please provide an item category'],
  },
  itemName: {
    type: String,
    required: [true, 'Please provide an item name'],
  },
  itemDescription: {
    type: String,
    required: [true, 'Please provide an item description'],
  },
  itemOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide an item owner'],
  },
  itemImages: {
    type: [String],
    required: [true, 'Please provide an item image'],
  },
  itemStatus: {
    type: String,
    enum: ['lost', 'found'],
    required: [true, 'Please provide an item status'],
  },
  lostLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: [true, 'Please provide a location type'],
    },
    coordinates: {
      type: [Number],
      required: [true, 'Please provide a location coordinates'],
    },
  },
  lostDate: {
    type: Date,
    required: [true, 'Please provide a lost date'],
  },
});

const Item = mongoose.model<ItemAttrs>('Item', ItemSchema);

export { Item };
