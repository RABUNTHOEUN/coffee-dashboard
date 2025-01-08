"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { baseUrl } from "@/utils/config";

const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: 0,
    inventoryId: 0,
    // imageUrl: "",
    discounts: [
      {
        discountId: 0,
        code: "",
        description: "",
        discountPercentage: 0,
        startDate: "",
        endDate: "",
        active: false,
      },
    ],
  });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch(`${baseUrl}/Categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleDiscountChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    const updatedDiscounts = [...product.discounts];
    updatedDiscounts[index] = {
      ...updatedDiscounts[index],
      [name]: type === "checkbox" ? checked : value,
    };
    setProduct({ ...product, discounts: updatedDiscounts });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = parseInt(e.target.value);
    setProduct({
      ...product,
      categoryId: selectedCategoryId,
    });
  };

  const handleAddDiscount = () => {
    setProduct({
      ...product,
      discounts: [
        ...product.discounts,
        {
          discountId: 0,
          code: "",
          description: "",
          discountPercentage: 0,
          startDate: "",
          endDate: "",
          active: false,
        },
      ],
    });
  };

  const handleRemoveDiscount = (index: number) => {
    const updatedDiscounts = product.discounts.filter((_, i) => i !== index);
    setProduct({ ...product, discounts: updatedDiscounts });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Product Name:", product.name);
    console.log("Product Description:", product.description);
    console.log("Product Price:", product.price);
    console.log("Product Category ID:", product.categoryId);
    console.log("Discounts:", product.discounts);

    // Basic validation
    if (
      !product.name ||
      !product.description ||
      !product.price ||
      !product.categoryId ||
      product.discounts.some((d) => !d.code || !d.discountPercentage)
    ) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Structure the data to match the backend API's CreateProductDto
    const createProductDto = {
      Name: product.name,
      Description: product.description,
      Price: product.price,
      CategoryId: product.categoryId,
      Discounts: product.discounts.map((d) => ({
        Code: d.code,
        Description: d.description,
        DiscountPercentage: d.discountPercentage,
        StartDate: d.startDate,
        EndDate: d.endDate,
        Active: d.active,
      })),
    };

    try {
      const response = await fetch(`${baseUrl}/Products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createProductDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating product:", errorData);
        toast.error(errorData.message || "Error creating product");
        throw new Error("Failed to create product");
      }

      toast.success("Product created successfully", {
        style: {
          color: "green",
        },
      });

      setProduct({
        name: "",
        description: "",
        price: 0,
        categoryId: 0,
        inventoryId: 0,
        discounts: [
          {
            discountId: 0,
            code: "",
            description: "",
            discountPercentage: 0,
            startDate: "",
            endDate: "",
            active: false,
          },
        ],
      });
    } catch (error) {
      toast.error("Error creating product");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full lg:w-1/2 mx-auto">
      <h2 className="text-xl font-bold mb-4">Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            type="text"
            name="description"
            placeholder="Product Description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : (
            <select
              id="category"
              name="categoryId"
              value={product.categoryId}
              onChange={handleCategoryChange}
              className="p-2 w-full border rounded-md"
              required
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Discount Fields */}
        {product.discounts.map((discount, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-medium mb-2">Discount {index + 1}</h3>
            <div className="mb-4">
              <Input
                type="text"
                name="code"
                placeholder="Discount Code"
                value={discount.code}
                onChange={(e) => handleDiscountChange(index, e)}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="text"
                name="description"
                placeholder="Discount Description"
                value={discount.description}
                onChange={(e) => handleDiscountChange(index, e)}
              />
            </div>
            <div className="mb-4">
              <Input
                type="number"
                name="discountPercentage"
                placeholder="Discount Percentage"
                value={discount.discountPercentage}
                onChange={(e) => handleDiscountChange(index, e)}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="date"
                name="startDate"
                placeholder="Start Date"
                value={discount.startDate}
                onChange={(e) => handleDiscountChange(index, e)}
              />
            </div>
            <div className="mb-4">
              <Input
                type="date"
                name="endDate"
                placeholder="End Date"
                value={discount.endDate}
                onChange={(e) => handleDiscountChange(index, e)}
              />
            </div>
            <div className="mb-4">
              <label>
                Active
                <input
                  type="checkbox"
                  name="active"
                  checked={discount.active}
                  onChange={(e) => handleDiscountChange(index, e)}
                />
              </label>
            </div>
            <Button
              type="button"
              onClick={() => handleRemoveDiscount(index)}
              disabled={product.discounts.length <= 1}
            >
              Remove Discount
            </Button>
          </div>
        ))}
        <Button type="button" onClick={handleAddDiscount}>
          Add Discount
        </Button>

        <Button type="submit" className="w-full my-4" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
};

export default CreateProduct;
