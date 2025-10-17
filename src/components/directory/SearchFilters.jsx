import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function SearchFilters({ 
  filters, 
  onFiltersChange, 
  type,
  onClear 
}) {
  const isDoer = type === "doer";

  return (
    <Card className="p-6 bg-white border-slate-200 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-slate-600" />
          <h3 className="font-bold text-lg text-slate-900">Filters</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-slate-600">
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder={isDoer ? "Search by name, skill, expertise..." : "Search by name, company..."}
              value={filters.search || ""}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10 border-slate-200"
            />
          </div>
        </div>

        {/* Status/Availability */}
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            {isDoer ? "Availability" : "Status"}
          </Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger className="border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {isDoer ? (
                <>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Busy">Busy</SelectItem>
                  <SelectItem value="On Project">On Project</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Potential">Potential</SelectItem>
                  <SelectItem value="Preferred">Preferred</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Favorites Only */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="favorites"
            checked={filters.favoritesOnly || false}
            onChange={(e) => onFiltersChange({ ...filters, favoritesOnly: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
          />
          <Label htmlFor="favorites" className="text-sm text-slate-700 cursor-pointer">
            Show favorites only
          </Label>
        </div>

        {/* Doer-specific filters */}
        {isDoer && (
          <>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Hourly Rate Range: ${filters.minRate || 0} - ${filters.maxRate || 500}
              </Label>
              <Slider
                min={0}
                max={500}
                step={10}
                value={[filters.minRate || 0, filters.maxRate || 500]}
                onValueChange={(value) => onFiltersChange({ 
                  ...filters, 
                  minRate: value[0], 
                  maxRate: value[1] 
                })}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Minimum Rating
              </Label>
              <Select
                value={filters.minRating?.toString() || "0"}
                onValueChange={(value) => onFiltersChange({ ...filters, minRating: parseFloat(value) })}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Sort */}
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">Sort By</Label>
          <Select
            value={filters.sortBy || "name"}
            onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
          >
            <SelectTrigger className="border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              {isDoer && (
                <>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="rate">Lowest Rate</SelectItem>
                  <SelectItem value="rate-desc">Highest Rate</SelectItem>
                </>
              )}
              <SelectItem value="recent">Recently Contacted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}