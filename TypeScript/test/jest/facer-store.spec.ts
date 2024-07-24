import { Item, FacerStore } from "@/facer-store";

describe("Facer Store", () => {
  it("should foo", () => {
    const facerStore = new FacerStore([new Item("foo", 0, 0)]);
    const items = facerStore.updateQuality();
    expect(items[0].name).toBe("foo");
  });
  it("Once the sell-by date has passed, Quality degrades twice as fast.", () => {
    const facerStore = new FacerStore([new Item("TISSOT", 0, 5)]);
    const items = facerStore.updateQuality();
    expect(items[0].quality).toBe(3);
  });
  it("The Quality of an item is never negative.", () => {
    const facerStore = new FacerStore([new Item("TISSOT", 0, 1)]);
    const items = facerStore.updateQuality();
    expect(items[0].quality).toBe(0);
  });
  it("'Vintage Rolex' actually increases in Quality the older it gets.", () => {
    const facerStore = new FacerStore([
      new Item("Vintage Rolex", 0, 1),
      new Item("Vintage Rolex", 2, 1),
    ]);
    const items = facerStore.updateQuality();
    expect(items[0].quality).toBe(3);
    expect(items[1].quality).toBe(2);
  });
  it("The Quality of an item is never more than 50.", () => {
    const facerStore = new FacerStore([new Item("Vintage Rolex", 0, 49)]);
    const items = facerStore.updateQuality();
    expect(items[0].quality).toBe(50);
    expect(items[0].sellIn).toBe(-1);
  });
  it("'Legendary Watch Face', being a legendary item, never has to be sold or decreases in Quality.", () => {
    const facerStore = new FacerStore([
      new Item("Legendary Watch Face", 0, 80),
    ]);
    const items = facerStore.updateQuality();
    expect(items[0].quality).toBe(80);
    expect(items[0].sellIn).toBe(0);
  });
  it("'Passes to Watchface Conference', like the Vintage Rolex, increases in Quality as its SellIn value approaches", () => {
    const facerStore = new FacerStore([
      new Item("Passes to Watchface Conference", 10, 5),
      new Item("Passes to Watchface Conference", 5, 5),
      new Item("Passes to Watchface Conference", 0, 5),
    ]);
    const items = facerStore.updateQuality();
    expect(items[0].quality).toBe(7);
    expect(items[1].quality).toBe(8);
    expect(items[2].quality).toBe(0);
  });
  it("'Fragile' items degrade in Quality twice as fast as normal items.", () => {
    const facerStore = new FacerStore([new Item("Fragile", 2, 10), new Item("Fragile", 0, 10)]);
    const items = facerStore.updateQuality();
    expect(items[0].quality).toBe(8);
    expect(items[1].quality).toBe(6);
  });
});
