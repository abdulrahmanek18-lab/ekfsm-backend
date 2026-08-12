    async create(data: any) {
    try {
      // Hardcode the Company ID since we know it exists in Supabase
      const companyId = '00000000-0000-0000-0000-000000000001';

      const count = await this.prisma.workOrder.count();
      const woNumber = `WO-${String(count + 1).padStart(5, '0')}`;

      const clean = (val: any) => (val === "" || val === undefined) ? null : val;

      return await this.prisma.workOrder.create({
        data: {
          woNumber,
          title: data.title,
          description: clean(data.description),
          priority: data.priority || 'MEDIUM',
          status: 'PENDING',
          scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
          companyId: companyId, // Hardcoded ID
          customerId: clean(data.customerId) || undefined,
          buildingId: clean(data.buildingId) || undefined,
          flatId: clean(data.flatId) || undefined,
          assetId: clean(data.assetId) || undefined,
        },
        include: { customer: true, building: true, asset: true }
      });
    } catch (error) {
      console.error('Error creating Work Order:', error);
      throw new Error(error.message || 'Failed to create Work Order');
    }
  }

      if (clean(data.customerId)) createData.customer = { connect: { id: clean(data.customerId) } };
      if (clean(data.buildingId)) createData.building = { connect: { id: clean(data.buildingId) } };
      if (clean(data.flatId)) createData.flat = { connect: { id: clean(data.flatId) } };
      if (clean(data.assetId)) createData.asset = { connect: { id: clean(data.assetId) } };

      return await this.prisma.workOrder.create({
        data: createData,
        include: { customer: true, building: true, asset: true }
      });
    } catch (error) {
      console.error('Error creating Work Order:', error);
      throw new Error(error.message || 'Failed to create Work Order');
    }
  }
