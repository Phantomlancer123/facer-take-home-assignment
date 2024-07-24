const SPECIAL_INCREASE_ITEM_LISTS = [
  "Vintage Rolex",
  "Passes to Watchface Conference",
];
const SPECIAL_DECREASE_ITEM_LISTS = ["Fragile"];
const LEGENDARY_WATCH = "Legendary Watch Face";
const LEGENDARY_QUALITY_THRESHOLD = 80;
const MAX_QUALITY_THRESHOLD = 50;
const SPECIAL_INCREASE_RATE = 1;
const NORMAL_DECREASE_RATE = 1;
const SPECIAL_DECREASE_RATE = 2;
const MIN_QUALITY_THRESHOLD = 0;

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class FacerStore {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  public updateQuality(): Array<Item> {
    for (const item of this.items) {
      this.updateQualityItem(item);
    }
    return this.items;
  }

  private updateQualityItem(item: Item): void {
    if (item.name == LEGENDARY_WATCH) {
      this.handleLegendaryQuality(item);
      return;
    }
    if (SPECIAL_INCREASE_ITEM_LISTS.includes(item.name)) {
      this.increaseQualityForSpecialItems(item);
    } else if (SPECIAL_DECREASE_ITEM_LISTS.includes(item.name)) {
      this.decreaseQualityForSpecialItems(item);
    } else {
      this.decreaseQualityForNonSpecialItems(item);
    }
    this.updateSellIn(item);
  }

  private handleLegendaryQuality(item: Item): void {
    if (item.name === LEGENDARY_WATCH) {
      item.quality = LEGENDARY_QUALITY_THRESHOLD;
      item.sellIn = 0;
    }
  }

  private increaseQualityForSpecialItems(item: Item): void {
    this.increaseQuality(item, SPECIAL_INCREASE_RATE);
    if (item.name === SPECIAL_INCREASE_ITEM_LISTS[1]) {
      this.specialConferenceRules(item);
    }
  }

  private decreaseQualityForNonSpecialItems(item: Item): void {
    this.decreaseQuality(item, NORMAL_DECREASE_RATE);
  }

  private decreaseQualityForSpecialItems(item: Item): void {
    this.decreaseQuality(item, SPECIAL_DECREASE_RATE);
  }

  private specialConferenceRules(item: Item): void {
    const CONFERENCES = [
      { daysBefore: 11, qualityIncrease: 1 },
      { daysBefore: 6, qualityIncrease: 1 },
    ];
    for (const conferenceRule of CONFERENCES) {
      if (item.sellIn < conferenceRule.daysBefore) {
        this.increaseQuality(item, conferenceRule.qualityIncrease);
      }
    }
  }

  private updateSellIn(item: Item): void {
    item.sellIn -= 1;
    if (item.sellIn < 0) {
      this.handleExpiredItems(item);
    }
  }

  private handleExpiredItems(item: Item): void {
    if (!SPECIAL_INCREASE_ITEM_LISTS.includes(item.name)) {
      SPECIAL_DECREASE_ITEM_LISTS.includes(item.name)
        ? this.decreaseQuality(item, SPECIAL_DECREASE_RATE)
        : this.decreaseQuality(item, NORMAL_DECREASE_RATE);
    } else {
      item.name === SPECIAL_INCREASE_ITEM_LISTS[1]
        ? (item.quality = MIN_QUALITY_THRESHOLD)
        : this.increaseQuality(item, SPECIAL_INCREASE_RATE);
    }
  }

  private increaseQuality(item: Item, quantity: number): void {
    item.quality + quantity <= MAX_QUALITY_THRESHOLD
      ? (item.quality += quantity)
      : (item.quality = MAX_QUALITY_THRESHOLD);
  }

  private decreaseQuality(item: Item, quantity: number): void {
    item.quality - quantity < MIN_QUALITY_THRESHOLD
      ? (item.quality = MIN_QUALITY_THRESHOLD)
      : (item.quality -= quantity);
  }
}
